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
                <h3 class="dropzone-custom-title">{{this.$t("proofDeposit.uploadProof")}}</h3>
                <div class="subtitle">{{this.$t("proofDeposit.uploadProofSubtitle")}}</div>
              </div>
            </vue-dropzone>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import proofService from "@/service/proof-service";
import vue2Dropzone from "vue2-dropzone";
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
      if (!this.proofData) {
        const fingerprint = await proofService.getFingerprint({
          file: this.proofData
        });
        const res = await proofService.compareFingerprints(fingerprint);
        if (res.data.status == "SUCCESS") {
          return true;
          console.log(res.data);
        } else {
          return false;
          console.log(res.data);
        }
      }
    }
  }
};
</script>