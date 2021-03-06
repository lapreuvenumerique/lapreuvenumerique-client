<template style="font-family: Helvetica;">
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
      <h2 class="mb-5">{{ this.$t("massdeposit.massdeposit") }}</h2>
      <b style="font-size:20px;">{{
        $t("massdeposit.maxSizePerFile") + " : " + maxSize
      }}</b>
      <v-form v-model="isValid">
        <v-row>
          <v-col cols="12">
            <VueFileAgent
              deletable="true"
              v-model="fileAgentFiles"
              multiple="true"
              @beforedelete="removeProof($event)"
            ></VueFileAgent>
          </v-col>
          <v-col cols="6" v-for="input in inputs" :key="input.title">
            <v-text-field
              :type="input.title == 'rgpdDuration' ? 'number' : ''"
              :label="$t(`common.togglelist.${input.title}`)"
              :rules="
                input.title != 'batchNumber'
                  ? input.required
                    ? [(value) => !!value || 'required']
                    : []
                  : [(value) => !!value || 'required']
              "
              :outlined="input.required"
              v-model="input.value"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-select
              dense
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
      proofData: [],
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
  props: {
    user: Object,
  },
  async mounted() {
    this.loadTopics();
    this.updateCredits();
    this.proofData = [];
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
      if (properties[i] == "batchNumber") {
        const temp = this.inputs[0];
        this.inputs[0] = {
          title: properties[i],
          required: currentProperty == 2,
          value: "",
        };
        this.inputs.push(temp);
      } else {
        this.inputs.push({
          title: properties[i],
          required: currentProperty == 2,
          value: "",
        });
      }
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
      if (err.response?.status == 401) {
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
        this.inputs[i].value = 1;
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
        console.log(err.response?.status);
        if (err.status == 401) {
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
    removeProof(file) {
      const index = this.fileAgentFiles.indexOf(file);
      if (index > -1) {
        this.fileAgentFiles.splice(index, 1);
      }
    },
    reset() {
      this.$emit("reset");
    },

    handleCreditCost() {
      this.creditCost = 0;
      let rgpdDuration = 1;
      for (let i = 0; i < this.inputs.length; i++) {
        if (this.inputs[i].title == "rgpdDuration" && this.inputs[i].value) {
          rgpdDuration = this.inputs[i].value;
        }
      }
      for (let s = 0; s < this.proofData.length; s++) {
        const file = this.proofData[s];
        console.log(this.proofData);
        const cost =
          Math.ceil(file.size / 1024 / this.clientInfo.creditSizeKo) *
          rgpdDuration *
          this.clientInfo.creditFile;
        this.creditCost += cost;
      }
      return;
    },
    async sendProof() {
      for (let i = 0; i < this.fileAgentFiles.length; i++) {
        if (this.fileAgentFiles[i].file.size > 0) {
          this.proofData[i] = this.fileAgentFiles[i].file;
        }
      }
      if (!this.isValid) {
        await Swal.fire({
          icon: "error",
          title: this.$t("massdeposit.formError"),
          text: this.$t("massdeposit.batchNumberRequired"),
          confirmButtonText: "OK!",
        });
        return;
      }
      if (this.proofData.length <= 1) {
        await Swal.fire({
          icon: "error",
          title: this.$t("proofDeposit.noFile"),
          text: this.$t("massdeposit.noFileProvidedMoreOne"),
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
        const res = await proofService.uploadProofs(this.proofData, formData);
        await this.updateCredits();
        this.reset();
        Swal.fire({
          title: this.$t("common.saveSuccess"),
          text: this.$t("common.dataUploaded"),
          icon: "success",
          confirmButtonText: "OK",
        });
      } catch (err) {
        console.log(err);
        let text =
          this.$t("common.dataNotUploaded") + " : " + err.response?.message;
        switch (err.response?.status) {
          case 401: {
            text = this.$t("common.keyRevokedDisabled");
            break;
          }
          case 403: {
            text = this.$t("common.notEnoughCredits");
            break;
          }
          case 422: {
            text = this.$t("common.infoNotValid");
            break;
          }
          case 500: {
            text = this.$t("common.serverError");
            break;
          }
          default: {
            text = this.$t("common.serverError");
            break;
          }
        }
        Swal.fire({
          title: this.$t("common.errorUpload"),
          text,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    },
  },
};
</script>
