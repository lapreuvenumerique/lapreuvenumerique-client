<template>
  <v-container>
    <v-row>
      <v-col cols="10" md="10" sm="7"></v-col>
      <v-col cols="2" md="2" sm="5">
        <v-card class="green lighten-1 white--text" align="right">
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
      <v-row></v-row>
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
      isValid: false
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
  },
  methods: {
    async updateCredits() {
      const credit = await clientService.getCredits();
      this.credits = credit.data.credits;
    },
    uploadProof(file) {
      this.proofData = file;
    },
    async sendProof() {
      if (!this.isValid) {
        return;
      }
      let formData = new FormData();
      const alertRes = await Swal.fire({
        title: this.$t("common.confirmUpload"),
        confirmButtonText: this.$t("common.confirm")
      });
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
        const res = await proofService.uploadProof(formData);
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