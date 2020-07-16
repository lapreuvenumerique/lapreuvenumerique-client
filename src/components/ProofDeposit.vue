<template>
  <v-container>
    <v-card class="pa-8">
      <h2 class="mb-5">{{this.$t("proofDeposit.proofDeposit")}}</h2>
      <v-row>
        
      </v-row>
      <v-form v-model="isValid">
        <v-row>
          <v-col cols="6" v-if="fileUpload">
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
import proofService from "@/service/proof-service";
export default {
  data() {
    return {
      proofData: String,
      inputs: [],
      dropzoneOptions: {
        url: "https://httpbin.org/post",
        thumbnailWidth: 500,
        addRemoveLinks: true,
        maxFiles: 1
      },
      isValid: false,
      fileUpload: false
    };
  },
  components: {
    vueDropzone: vue2Dropzone
  },
  async mounted() {
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
        this.fileUpload = true;
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
    uploadProof(file) {
      this.proofData = file;
    },
    async sendProof() {
      if (!this.isValid) {
        return;
      }
      let formData = new FormData();
      if (this.proofData) {
        formData.append("file", this.proofData);
      }
      const alertRes = await Swal.fire({
        title: this.$t("common.confirmUpload"),
        confirmButtonText: this.$t("common.confirm")
      });
      for (let i = 0; i < this.inputs.length; i++) {
        if (this.inputs[i].value) {
          formData.append(this.inputs[i].title, this.inputs[i].value);
        }
      }
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
          console.log(res.data);
        }
      } catch (err) {
        let text = this.$t("common.dataNotUploaded") + " : " + err.message;
        switch (err.status) {
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