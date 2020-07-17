<template>
  <v-container>
    <v-row>
      <v-col cols="10" md="10" sm="7"></v-col>
      <v-col cols="2" md="2" sm="5">
        <v-card :class="credits > 50? 'green':'red'" class="lighten-1 white--text" align="right">
          <v-row align="center" justify="center">
            <v-col cols="6" class="text-left px-7">
              <v-icon
                class="mdi full-width full-height"
                color="white"
                size="60"
              >mdi-currency-usd-circle-outline</v-icon>
            </v-col>
            <v-col cols="6" class="text-right px-7">
              <span style="font-size:15px; font-weight: 300;">{{ $tc("common.credits", credits)}}</span>
              <br />
              <b style="font-size:25px;">{{credits}}</b>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-card class="pa-8">
      <h2 class="mb-5">{{this.$t("proofDeposit.proofDeposit")}}</h2>
      <b style="font-size:25px;">{{$t("proofDeposit.maxSize") + " : " + maxSize}}</b>
      <v-form v-model="isValid">
        <v-row>
          <v-col cols="12">
            <vue-dropzone
              ref="proofDropzone"
              id="dropzone"
              :options="dropzoneOptions"
              :useCustomSlot="true"
              @vdropzone-success="(file, response) => this.uploadProof(file)"
            >
              <div class="dropzone-custom-content">
                <h3 class="dropzone-custom-title">{{this.$t("proofDeposit.uploadProof")}}</h3>
                <div class="subtitle">{{this.$t("proofDeposit.uploadProofSubtitle")}}</div>
              </div>
            </vue-dropzone>
          </v-col>
          <v-col cols="6" v-for="input in inputs" :key="input.title">
            <v-text-field
              :label="$t(`common.togglelist.${input.title}`)"
              :rules="input.required? [value => !!value || 'required']: []"
              :outlined="input.required"
              v-model="input.value"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-col cols="12" style="text-align: right;">
          <v-btn @click="sendProof()" color="primary">{{$t('common.submit')}}</v-btn>
        </v-col>
      </v-form>
    </v-card>
  </v-container>
</template>
<script>
import vue2Dropzone from "vue2-dropzone";
import dbService from "../service/db-service";
import Swal from "sweetalert2";
import clientService from "@/service/client-service";
import proofService from "@/service/proof-service";
export default {
  data() {
    return {
      proofData: String,
      inputs: [],
      credits: 0,
      dropzoneOptions: {
        url: "https://httpbin.org/post",
        thumbnailWidth: 500,
        addRemoveLinks: true,
        maxFiles: 1
      },
      isValid: false,
      maxSize: "1000ko",
      clientInfo: {},
      creditCost: 0
    };
  },
  components: {
    vueDropzone: vue2Dropzone
  },
  async mounted() {
    this.updateCredits();
    const dropzone = this.$refs.proofDropzone;
    if (dropzone) {
      dropzone.$el.addEventListener("vdropzone-success", $event =>
        this.uploadProof($event)
      );
    }

    let properties = Object.keys(this.user.properties);
    for (let i = 0; i < properties.length; i++) {
      let currentProperty = this.user.properties[properties[i]];
      if (currentProperty == 0) {
        continue;
      }
      if (properties[i] == "file" && currentProperty != 0) {
        continue;
      }
      this.inputs.push({
        title: properties[i],
        required: currentProperty == 2,
        value: ""
      });
    }
    try {
      const clientInforequest = await clientService.getInfo();
      this.clientInfo = clientInforequest.data;
      let resmaxSize = clientInforequest.data.maxSize;
      let suffix = "Ko";
      if (resmaxSize > 1024000) {
        resmaxSize /= 1024000;
        suffix = "Go";
      } else if (resmaxSize > 1024) {
        resmaxSize /= 1024;
        suffix = "Mo";
      }
      resmaxSize = Math.round(resmaxSize);
      this.maxSize = resmaxSize + suffix;
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    async updateCredits() {
      const credit = await clientService.getCredits();
      this.credits = credit.data.credits;
    },
    uploadProof(file) {
      this.proofData = file;
      let rgpdDuration = this.inputs[7].value
      if(!rgpdDuration){
        rgpdDuration = 2
      }
      this.creditCost = this.handleCreditCost(
        file.size / 1024,
        rgpdDuration,
        this.clientInfo
      );
    },
    handleCreditCost(filesize, rgpdDuration, client) {
      const cost =
        Math.ceil(filesize / client.creditSizeKo) *
        rgpdDuration *
        client.creditFile;
      console.log(cost);
      return cost;
    },
    async sendProof() {
      if (!this.isValid) {
        return;
      }
      let formData = new FormData();
      const alertRes = await Swal.fire({
        title: this.$t("common.confirmUpload"),
        text: this.$t("proofDeposit.price") + " : " + this.creditCost + this.$tc("common.credits", {count : this.creditCost}),
        showCancelButton: true,
        cancelButtonText: this.$t("common.cancel"),
        confirmButtonText: this.$t("common.confirm")
      });
      if (!alertRes.isConfirmed) {
        return;
      }
      for (let i = 0; i < this.inputs.length; i++) {
        if (this.inputs[i].value) {
          if (this.inputs[i].title == "copy") {
            let splitValue = this.inputs[i].value.split(" ");
            splitValue.push(this.user.email);
            formData.append(this.inputs[i].title, splitValue);
            continue;
          }
          formData.append(this.inputs[i].title, this.inputs[i].value);
        }
      }
      formData.append("file", this.proofData);
      formData.append("noDuplicate", this.user.noDuplicate);
      formData.append("sourceApp", "electronApp");
      formData.append("keepFile", this.user.keepFiles);
      formData.append("email", this.user.email);
      try {
        let waitAlert = Swal.fire({
          title: this.$t("common.wait"),
          text: this.$t("common.uploadingData"),
          icon: "info",
          showConfirmButton: false,
          allowOutsideClick: false
        });
        const res = await proofService.uploadProof(formData);
        await this.updateCredits();
        if (res.data.status == "SUCCESS") {
          Swal.fire({
            title: this.$t("common.saveSuccess"),
            text: this.$t("common.dataUploaded"),
            icon: "success",
            confirmButtonText: "OK"
          });
        } else {
          Swal.fire({
            title: this.$t("common.errorUpload"),
            text: this.$t("common.dataNotUploaded") + " : " + res.data.message,
            icon: "error",
            confirmButtonText: "OK"
          });
        }
      } catch (err) {
        let text =
          this.$t("common.dataNotUploaded") + " : " + err.response.message;
        switch (err.response.status) {
          case 401: {
            text = this.$t("common.credentialsIncorrect");
            break;
          }
          case 403: {
            break;
          }
          case 500: {
            break;
          }
          default: {
          }
        }
        Swal.fire({
          title: this.$t("common.errorUpload"),
          text,
          icon: "error",
          confirmButtonText: "OK"
        });
      }
    }
  },
  props: {
    user: Object
  }
};
</script>