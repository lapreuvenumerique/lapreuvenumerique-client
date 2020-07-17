<template>
  <v-container>
    <v-card class="pa-8">
      <h2 class="mb-5">{{this.$t("integrity.dataIntergrity")}}</h2>
      <v-row class="mt-5">
        <v-col cols="12" class="text-center mt-10">
          <h1 class="mb-10">{{this.$t("integrity.verifyDataIntegrity")}}</h1>
          <v-btn
            color="primary"
            x-large
            class="ma-10"
            :loading="isLoading"
            :disabled="wait"
            @click="verifyIntegrity"
          >{{this.btnText}}</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
<script>
import integrityService from "@/service/integrity-service";
import swal from "sweetalert2";
export default {
  data() {
    return {
      isLoading: false,
      wait: false,
      btnText: this.$t("integrity.verify"),
      result: ""
    };
  },
  methods: {
    async verifyIntegrity() {
      this.isLoading = true;
      this.wait = true;
      let waitAlert = swal.fire({
        title: this.$t("common.wait"),
        text: this.$t("common.uploadingData"),
        icon: "info",
        showConfirmButton: false,
        allowOutsideClick: false
      });
      const res = await integrityService.verifyIntegrity();
      if (res.data.status == "FAILED") {
        this.result = res.data.message;
        this.isLoading = false;
        swal.fire({
          icon: "error",
          title: this.$t("common.error"),
          text: this.$t("integrity.blockchainIntegrityIncorrect"),
          confirmButtonText: "OK!"
        });
        return;
      }
      this.result =
        this.$t("integrity.integrityOfBlockchain") +
        " " +
        res.data.number +
        " " +
        this.$tc("integrity.recordIsCorrect", { count: res.data.number });
      this.isLoading = false;
      this.waitForSeconds(20);
      swal.fire({
        icon: "success",
        title: this.$t("common.success"),
        text:
          this.$t("integrity.integrityOfBlockchain") +
          " " +
          res.data.number +
          " " +
          this.$tc("integrity.recordIsCorrect", { count: res.data.number }),
        confirmButtonText: "OK!"
      });
    },
    waitForSeconds(index) {
      if (index == 0) {
        this.wait = false;
        this.btnText = this.$t("integrity.verify");
        return;
      } else {
        this.btnText = this.$t("integrity.waitFor") + " " + index;
        +" " + this.$tc("integrity.second", { count: index });
        setTimeout(() => this.waitForSeconds(index - 1), 1000);
      }
    }
  }
};
</script>