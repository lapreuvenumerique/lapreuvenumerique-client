<template>
  <v-container>
    <v-card class="pa-8">
      <h2 class="mb-5">{{this.$t("fileExistence.verifyFileExistence")}}</h2>
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
                <h3 class="dropzone-custom-title">{{this.$t("fileExistence.uploadProof")}}</h3>
                <div class="subtitle">{{this.$t("fileExistence.uploadProofSubtitle")}}</div>
              </div>
            </vue-dropzone>
            <div class="text-right">
              <v-btn color="primary" @click="sendProof()" class="mt-10">{{$t("common.submit")}}</v-btn>
            </div>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import proofService from "@/service/proof-service";
import vue2Dropzone from "vue2-dropzone";
import swal from "sweetalert2";
export default {
  data() {
    return {
      proofData: "",
      isValid: false,
      dropzoneOptions: {
        url: "https://httpbin.org/post",
        thumbnailWidth: 500,
        addRemoveLinks: true,
        maxFiles: 1
      }
    };
  },
  mounted() {
    const dropzone = this.$refs.proofDropzone;
    if (dropzone) {
      dropzone.$el.addEventListener("vdropzone-success", $event =>
        this.uploadProof($event)
      );
    }
  },
  components: {
    vueDropzone: vue2Dropzone
  },
  methods: {
    uploadProof(file) {
      this.proofData = file;
    },
    async sendProof() {
      if (this.proofData) {
        let formData = new FormData();
        formData.append("file", this.proofData);
        const res1 = await proofService.getFingerprint(formData);
        const res2 = await proofService.compareFingerprints({
          fingerprint: res1.data.fingerprint
        });
        if (res2.data.status == "SUCCESS") {
          swal.fire({
            icon: "success",
            title: this.$t("common.success"),
            text:
              this.$tc("fileExistence.fileExists", {
                count: res2.data.ids.length
              }) +
              " " +
              res2.data.ids,
            confirmButtonText: "OK!"
          });
          return true;
        } else {
          swal.fire({
            icon: "error",
            title: this.$t("common.error"),
            text: this.$tc("fileExistence.noFileExists"),
            confirmButtonText: "OK!"
          });
          console.log(res2.data);
          return false;
        }
      }
    }
  }
};
</script>