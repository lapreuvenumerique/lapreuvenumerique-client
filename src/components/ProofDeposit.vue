<template>
  <v-container>
    <v-card class="pa-8">
      <v-card
        v-show="creditsEnabled"
        :class="credits > 50 ? 'green' : 'red'"
        class="lighten-1 white--text"
        align="right"
        style="position: absolute; z-index: 5; right:34px; top:30px"
      >
        <v-row align="center" justify="center">
          <v-col cols="6" class="text-left px-7">
            <v-icon class="mdi full-width full-height" color="white" size="60"
              >mdi-currency-usd-circle-outline</v-icon
            >
          </v-col>
          <v-col cols="6" class="text-right">
            <span style="font-size:15px; font-weight: 300;" class="mr-5">{{
              capitalizeFLetter($tc("common.credit", credits))
            }}</span>
            <br />
            <b style="font-size:25px;white-space: nowrap;" class="mr-5">{{
              formatNumber(credits)
            }}</b>
          </v-col>
        </v-row>
      </v-card>
      <h2 class="mb-5">{{ this.$t("proofDeposit.proofDeposit") }}</h2>
      <b style="font-size:20px;">{{
        $t("proofDeposit.maxSize") + " : " + maxSize
      }}</b>
      <v-form v-model="isValid">
        <v-row>
          <v-col cols="12">
            <VueFileAgent v-model="fileAgentFiles" multiple="false"></VueFileAgent>
          </v-col>
          <v-col cols="6" v-for="input in inputs" :key="input.title">
            <v-text-field
              :label="$t(`common.togglelist.${input.title}`)"
              :rules="input.required ? [(value) => !!value || 'required'] : []"
              :outlined="input.required"
              v-model="input.value"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-select
              :items="topics"
              :label="$t('common.togglelist.topic')"
              v-model="topic.value"
              v-if="topic.isActive"
            ></v-select>
          </v-col>
          <v-col
            v-for="chipinput in chipsinputs"
            :key="chipinput.title"
            cols="6"
          >
            <v-combobox
              v-model="chipinput.value"
              chips
              clearable
              dense
              :label="$t(`common.togglelist.${chipinput.title}`)"
              multiple
            >
              <template v-slot:selection="{ attrs, item, select, selected }">
                <v-chip
                  v-bind="attrs"
                  :input-value="selected"
                  close
                  @click="select"
                  @click:close="remove(chipinput, item)"
                >
                  <strong>{{ item }}</strong>
                </v-chip>
              </template>
            </v-combobox>
          </v-col>
        </v-row>
        <v-col cols="12" style="text-align: right;">
          <v-btn @click="sendProof()" color="primary">{{
            $t("common.submit")
          }}</v-btn>
        </v-col>
      </v-form>
    </v-card>
  </v-container>
</template>
<script>
import dbService from "../service/db-service";
import Swal from "sweetalert2";
import clientService from "@/service/client-service";
import proofService from "@/service/proof-service";
import numeral from "numeral";
import VueFileAgent from "vue-file-agent";
import VueFileAgentStyles from "vue-file-agent/dist/vue-file-agent.css";
export default {
  data() {
    return {
      proofData: String,
      inputs: [],
      chipsinputs: [],
      credits: 0,
      creditsEnabled: false,
      isValid: false,
      maxSize: "1000ko",
      clientInfo: {},
      creditCost: 0,
      topics: [],
      topic: { isActive: false, value: "Default" },
      fileAgentFiles: [],
    };
  },
  components: {},
  async mounted() {
    this.loadTopics();
    this.updateCredits();
    this.proofData = "";
    let properties = Object.keys(this.user.properties);
    for (let i = 0; i < properties.length; i++) {
      let currentProperty = this.user.properties[properties[i]];
      if (currentProperty == 0) {
        continue;
      }
      if (properties[i] == "file" && currentProperty != 0) {
        continue;
      }
      if (
        (properties[i] == "copy" || properties[i] == "keywords") &&
        currentProperty != 0
      ) {
        this.chipsinputs.push({
          title: properties[i],
          required: currentProperty == 2,
          value: "",
        });
        continue;
      }
      if (properties[i] == "topic") {
        this.topic.isActive = properties[i] != 0;
        continue;
      }
      this.inputs.push({
        title: properties[i],
        required: currentProperty == 2,
        value: "",
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
      if (err.response.status == 401) {
        const alertErr = await Swal.fire({
          icon: "error",
          title: this.$t("common.error"),
          text: this.$t("common.keyRevokedDisabled"),
        });
        this.$router.push("/login");
      }
      console.log(err);
    }
    for (let i = 0; i < this.inputs.length; i++) {
      if (this.inputs[i].title == "rgpdDuration") {
        this.inputs[i].value = 2;
      }
    }
  },
  methods: {
    capitalizeFLetter(value) {
      return value[0].toUpperCase() + value.slice(1);
    },
    async loadTopics() {
      try {
        const res = await clientService.getTopics();
        for (let i = 0; i < res.data.topics.length; i++) {
          this.topics.push(res.data.topics[i].name);
        }
      } catch (err) {
        console.log(err.response.status);
        if (err.response.status == 401) {
          const alertErr = await Swal.fire({
            icon: "error",
            title: this.$t("common.error"),
            text: this.$t("common.keyRevokedDisabled"),
          });
          this.$router.push("/login");
        }
        console.log(err);
      }
    },
    formatNumber(number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },

    remove(input, item) {
      input.value.splice(input.value.indexOf(item), 1);
      input.value = [...input.value];
    },
    async updateCredits() {
      try {
        const credit = await clientService.getCredits();
        this.creditsEnabled = credit.data.creditsEnabled;
        if (this.creditsEnabled) {
          this.credits = credit.data.credits;
        }
      } catch (err) {
        await Swal.fire({
          title: this.$t("common.error"),
          text: this.$t("common.serverError"),
        });
      }
    },
    reset() {
      this.$emit("reset");
    },

    handleCreditCost() {
      const file = this.proofData;
      let rgpdDuration = 1;
      for (let i = 0; i < this.inputs.length; i++) {
        if (this.inputs[i].title == "rgpdDuration" && this.inputs[i].value) {
          let rgpdDuration = this.inputs[i].value;
        }
      }
      const cost =
        Math.ceil(file.size / 1024 / this.clientInfo.creditSizeKo) *
        rgpdDuration *
        this.clientInfo.creditFile;
      this.creditCost = cost;
      return;
    },
    async sendProof() {
      this.proofData = this.fileAgentFiles[0].file;
      if (!this.isValid) {
        return;
      }
      if (!this.proofData) {
        await Swal.fire({
          icon: "error",
          title: this.$t("proofDeposit.noFile"),
          text: this.$t("proofDeposit.noFileProvided"),
          confirmButtonText: "OK!",
        });
        return;
      }
      let formData = new FormData();
      this.handleCreditCost();
      const alertRes = await Swal.fire({
        title: this.$t("common.confirmUpload"),
        text:
          this.$t("proofDeposit.price") +
          " : " +
          this.creditCost +
          " " +
          this.$tc("common.credit", parseInt(this.creditCost, 10)),
        showCancelButton: true,
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
      });

      if (!alertRes.isConfirmed) {
        return;
      }
      for (let i = 0; i < this.inputs.length; i++) {
        if (this.inputs[i].value != "") {
          formData.append(this.inputs[i].title, this.inputs[i].value);
        }
      }
      for (let i = 0; i < this.chipsinputs.length; i++) {
        if (this.chipsinputs[i].value != "") {
          formData.append(this.chipsinputs[i].title, this.chipsinputs[i].value);
        }
      }
      formData.append("file", this.proofData);
      formData.append("noDuplicate", this.user.noDuplicate);
      formData.append("keepFile", this.user.keepFiles);
      formData.append("email", this.user.email);
      formData.append("sourceApp", "electronApp");
      formData.append("topic", this.topic.value);
      formData.append("identity", this.user.username);
      try {
        let waitAlert = Swal.fire({
          title: this.$t("common.wait"),
          text: this.$t("common.uploadingData"),
          icon: "info",
          showConfirmButton: false,
          allowOutsideClick: false,
        });
        const res = await proofService.uploadProof(formData);
        this.reset();
        Swal.fire({
          title: this.$t("common.saveSuccess"),
          text: this.$t("common.dataUploaded"),
          icon: "success",
          confirmButtonText: "OK",
        });
        await this.updateCredits();
      } catch (err) {
        console.log(err);
        let text =
          this.$t("common.dataNotUploaded") + " : " + err.response.message;
        switch (err.response.status) {
          case 401: {
            text = this.$t("common.keyRevokedDisabled");
          }
          case 422: {
            text = this.$t("common.infoNotValid");
          }
          case 500: {
          }
        }
        Swal.fire({
          title: this.$t("common.errorUpload"),
          text: text,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    },
  },
  props: {
    user: Object,
  },
};
</script>
<style scoped>
.dropbox {
  outline: 2px dashed grey; /* the dash box */
  outline-offset: -10px;
  background: lightcyan;
  color: dimgray;
  padding: 10px 10px;
  min-height: 200px; /* minimum height */
  position: relative;
  cursor: pointer;
}

.input-file {
  opacity: 0; /* invisible but it's there! */
  width: 100%;
  height: 200px;
  position: absolute;
  cursor: pointer;
}

.dropbox:hover {
  background: lightblue; /* when mouse over to the drop zone, change color */
}

.dropbox p {
  font-size: 1.2em;
  text-align: center;
  padding: 50px 0;
}
</style>
