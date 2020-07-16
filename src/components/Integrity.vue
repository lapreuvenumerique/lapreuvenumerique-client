<template>
  <v-container>
    <v-card class="pa-8">
      <h2 class="mb-5">{{this.$t("integrity.dataIntergrity")}}</h2>
      <v-row class="mt-5">
        <v-col cols="12" class="text-center">
          <h1>{{this.$t("integrity.verifyDataIntegrity")}}</h1>
          <v-btn
            color="primary"
            x-large
            class="ma-10"
            :loading="isLoading"
            :disabled="wait"
            @click="verifyIntegrity"
          >{{this.btnText}}</v-btn>
          <h3>{{this.result}}</h3>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
<script>
import integrityService from "@/service/integrity-service";
export default {
  data() {
    return {
      isLoading: false,
      wait: false,
      btnText: this.$t("integrity.verify"),
      result: "Result : "
    };
  },
  methods: {
    async verifyIntegrity() {
      this.isLoading = true;
      this.wait = true;
      const res = await integrityService.verifyIntegrity();
      if (res.data.status == "FAILED") {
        this.result = res.data.message;
        this.isLoading = false;
        return;
      }
      this.result =
        this.$t("integrity.integrityOfBlockchain") +
        " " +
        res.data.number +
        " " +
        this.$tc("integrity.recordIsCorrect", { count: res.data.number });
      this.isLoading = false
      this.waitForSeconds(20)
    },
    waitForSeconds(index) {
      if (index == 0) {
        this.wait = false;
        this.btnText = this.$t("integrity.verify")
        return
      } 
      else {
        this.btnText = this.$t("integrity.waitFor") + " " + index; + " " + this.$tc("integrity.second", {count :index})
        setTimeout(() => this.waitForSeconds(index - 1), 1000);
      }
    }
  }
};
</script>