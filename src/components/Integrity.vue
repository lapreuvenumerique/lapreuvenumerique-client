<template>
  <v-container>
    <v-card class="pa-8">
      <h2 class="mb-5">{{this.$t("integrity.dataIntergrity")}}</h2>
      <v-row>
        <v-col cols="12" class="text-center">
          <h1>{{this.$t("integrity.verifyDataIntegrity")}}</h1>
          <v-btn color="primary" x-large class="ma-10" @click="verifyIntegrity">{{this.btnText}}</v-btn>
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
      btnText: this.$t("integrity.verify"),
      result: ""
    };
  },
  props: {},
  methods: {
    async verifyIntegrity() {
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
    }
  }
};
</script>