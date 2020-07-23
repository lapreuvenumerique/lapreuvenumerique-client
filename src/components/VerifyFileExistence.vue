<template>
  <v-container>
    <v-card class="pa-8">
      <h2 class="mb-5">{{this.$t("fileExistence.verifyFileExistence")}}</h2>
      <v-form v-model="isValid">
        <v-row>
          <v-col cols="12">
            <VueFileAgent v-model="fileAgentFiles" multiple="false"></VueFileAgent>
          </v-col>
          <v-col cols="12" class="text-right">
            <v-btn color="primary" @click="sendProof">
              {{$t("common.submit")}}
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import proofService from "@/service/proof-service";
import Swal from "sweetalert2";
import VueFileAgent from "vue-file-agent";
import VueFileAgentStyles from "vue-file-agent/dist/vue-file-agent.css";
export default {
  data() {
    return {
      proofData: "",
      isValid: false,
      fileAgentFiles: []
    };
  },
  mounted() {
    
  },
  components: {
  },
  methods: {
    reset() {
      this.$emit("reset");
    },
    async sendProof() {
      this.proofData = this.fileAgentFiles[0]?.file
      if (this.proofData) {
        let formData = new FormData();
        formData.append("file", this.proofData);
        let waitAlert = Swal.fire({
          title: this.$t("common.wait"),
          text: this.$t("common.uploadingData"),
          icon: "info",
          showConfirmButton: false,
          allowOutsideClick: false
        });
        try {
          const res1 = await proofService.getFingerprint(formData);
          const res2 = await proofService.compareFingerprints({
            fingerprint: res1.data.fingerprint
          });
          this.reset();
          Swal.fire({
            icon: "success",
            title: this.$t("common.success"),
            text:
              this.$tc("fileExistence.fileExists", res2.data.ids.length) +
              " " +
              res2.data.ids,
            confirmButtonText: "OK!"
          });
          return true;
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: this.$t("common.error"),
            text: this.$tc("fileExistence.noFileExists"),
            confirmButtonText: "OK!"
          });
          return false;
        }
      } else {
        Swal.fire({
          title: this.$t("common.error"),
          text: this.$t("fileExistence.noFileProvided"),
          icon: "error",
          confirmButtonText: "OK"
        });
      }
    }
  }
};
</script>