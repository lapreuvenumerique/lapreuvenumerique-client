<template>
  <v-container>
    <v-card class="pa-8">
      <v-card
        class="lighten-1 white--text green"
        align="right"
        style="position: absolute; z-index: 5; right:50px; top:30px"
      >
        <v-row align="center" justify="center">
          <v-col cols="3" class="text-left px-7">
            <v-icon class="mdi full-width full-height" color="white" size="60">mdi-database</v-icon>
          </v-col>
          <v-col cols="9" class="text-right px-7">
            <span style="font-size:15px; font-weight: 300;">{{$t("proofQuery.proofCount")}}</span>
            <br />
            <b style="font-size:25px;white-space: nowrap;">{{formatNumber(proofCount)}}</b>
          </v-col>
        </v-row>
      </v-card>
en      <h2 class="mb-10">{{this.$t("proofDeposit.proofDeposit")}}</h2>
      <h3 class="mt-10 mb-4">{{this.$t("proofQuery.searchFields")}} :</h3>
      <v-row>
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-header>{{$t("common.fields")}}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row class="d-flex align-center">
                <v-col
                  cols="5"
                  class="d-flex align-center"
                  v-for="field in fields"
                  :key="field.field"
                >
                  <v-text-field
                    :label="field.title"
                    outlined
                    v-model="field.value"
                    v-if="field.field != 'keywords' && field.field != 'topic'"
                    dense
                    required
                    autofocus
                  ></v-text-field>
                  <v-combobox
                    v-model="field.value"
                    chips
                    clearable
                    multiple
                    outlined
                    dense
                    :label="field.title"
                    v-if="field.field == 'keywords'"
                  >
                    <template v-slot:selection="{ attrs, item, select, selected }">
                      <v-chip
                        v-bind="attrs"
                        :input-value="selected"
                        close
                        @click="select"
                        @click:close="remove(field.value, item)"
                        required
                      >
                        <strong>{{ item }}</strong>
                      </v-chip>
                    </template>
                  </v-combobox>
                  <v-select
                    :label="field.title"
                    :items="topics"
                    v-model="field.value"
                    dense
                    outlined
                    required
                    v-if="field.field == 'topic'"
                  ></v-select>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-col cols="12" class="text-right">
          <v-btn color="primary" @click="searchQuery(field, value)">{{$t("common.search")}}</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4">
          <v-text-field
            append-icon="mdi-magnify"
            single-line
            hide-details
            :label="$t('proofQuery.searchValues')"
            v-model="search"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-data-table
        :headers="headers"
        :items="proofs"
        item-key="id"
        class="elevation-1"
        :search="search"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon small @click="downloadFile(item.id, item.filename)" class="mr-2">mdi-download</v-icon>
          <v-icon
            @click="downloadReceipt(item.id, 'receipt-' + item.filename)"
            small
          >mdi-download-lock</v-icon>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
<script>
import clientService from "@/service/client-service";
import swal from "sweetalert2";
import fileDownload from "js-file-download";
import moment from "moment";
import numeral from "numeral";
export default {
  data() {
    return {
      field: "",
      value: "",
      search: "",
      finishedLoading: false,
      proofCount: 0,
      headers: [
        { text: this.$t("proofQuery.id"), value: "id" },
        { text: this.$t("common.togglelist.filename"), value: "filename" },
        { text: this.$t("common.togglelist.folderName"), value: "foldername" },
        { text: this.$t("common.togglelist.reference"), value: "reference" },
        { text: this.$t("common.togglelist.uids"), value: "uids" },
        { text: this.$t("common.togglelist.identity"), value: "identity" },
        {
          text: this.$t("common.togglelist.batchNumber"),
          value: "batchnumber"
        },
        { text: this.$t("common.togglelist.topic"), value: "topic" },
        {
          text: this.$t("common.togglelist.rgpdDuration"),
          value: "rgpdduration"
        },
        { text: this.$t("common.togglelist.keywords"), value: "keywords" },
        { text: this.$t("proofQuery.date"), value: "uploaddate" },
        { text: this.$t("proofQuery.fingerprint"), value: "fingerprint" },
        {
          text: this.$t("proofQuery.actions"),
          value: "actions",
          sortable: false
        }
      ],
      headersSelect: [
        { text: this.$t("proofQuery.id"), value: "id" },
        { text: this.$t("common.togglelist.filename"), value: "filename" },
        { text: this.$t("common.togglelist.folderName"), value: "foldername" },
        { text: this.$t("common.togglelist.reference"), value: "reference" },
        { text: this.$t("common.togglelist.uids"), value: "uids" },
        { text: this.$t("common.togglelist.identity"), value: "identity" },
        {
          text: this.$t("common.togglelist.batchNumber"),
          value: "batchnumber"
        },
        { text: this.$t("common.togglelist.topic"), value: "topic" },
        {
          text: this.$t("common.togglelist.rgpdDuration"),
          value: "rgpdduration"
        },
        { text: this.$t("common.togglelist.keywords"), value: "keywords" },
        { text: this.$t("proofQuery.date"), value: "uploaddate" },
        { text: this.$t("proofQuery.fingerprint"), value: "fingerprint" }
      ],
      proofs: [],
      topics: [],
      topicValue: "",
      fields: [
        {
          field: "id",
          title: this.$t("common.togglelist.id"),
          value: ""
        },
        {
          field: "fileName",
          title: this.$t("common.togglelist.filename"),
          value: ""
        },
        {
          field: "folderName",
          title: this.$t("common.togglelist.folderName"),
          value: ""
        },
        {
          field: "reference",
          title: this.$t("common.togglelist.reference"),
          value: ""
        },
        {
          field: "uids",
          title: this.$t("common.togglelist.uids"),
          value: ""
        },
        {
          field: "identity",
          title: this.$t("common.togglelist.identity"),
          value: ""
        },
        {
          field: "batchNumber",
          title: this.$t("common.togglelist.batchNumber"),
          value: ""
        },
        {
          field: "topic",
          title: this.$t("common.togglelist.topic"),
          value: "Default"
        },
        {
          field: "rgpdDuration",
          title: this.$t("common.togglelist.rgpdDuration"),
          value: "1"
        },
        {
          field: "keywords",
          title: this.$t("common.togglelist.keywords"),
          value: ""
        },
        {
          field: "date",
          title: this.$t("common.togglelist.date"),
          value: ""
        },
        {
          field: "fingerprint",
          title: this.$t("common.togglelist.fingerprint"),
          value: ""
        }
      ]
    };
  },
  mounted() {
    this.loadProofCount();
    this.loadTopics();
  },
  methods: {
    async loadTopics() {
      try {
        const res = await clientService.getTopics();
        this.topicValue = res.data.topics[0].name;
        for (let i = 0; i < res.data.topics.length; i++) {
          this.topics.push(res.data.topics[i].name);
        }
      } catch (err) {
        console.log(err);
      }
    },
    remove(value, item) {
      value.splice(value.indexOf(item), 1);
      value = [...value];
    },
    async downloadFile(id, name) {
      const res = await clientService.downloadProof(id);
      fileDownload(res.data, name);
    },
    async downloadReceipt(id, name) {
      const res = await clientService.downloadReceipt(id);
      fileDownload(res.data, name);
    },
    async loadProofCount() {
      try {
        const res = await clientService.getProofCount();
        this.proofCount = res.data.number;
      } catch (err) {
        console.log(err);
      }
    },
    formatNumber(number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },
    async searchQuery(field, value) {
      let waitAlert = swal.fire({
        title: this.$t("common.wait"),
        text: this.$t("proofQuery.searchingDB"),
        icon: "info",
        showConfirmButton: false,
        allowOutsideClick: false
      });
      let data = {};
      for (let i = 0; i < this.fields.length; i++) {
        let value = this.fields[i].value;
        if (this.fields[i].field == "id") {
          if(!value){
            value = undefined
          }
        }
        data[this.fields[i].field] = value;
      }
      console.log(data);
      try {
        const res = await clientService.getQuery(data);
        this.proofs = res.data.files;
        for (let i = 0; i < this.proofs.length; i++) {
          this.proofs[i].uploaddate = moment(this.proofs[i].uploaddate).format(
            "L"
          );
        }
        let successRes = await swal.fire({
          title: this.$t("common.success"),
          text: this.$t("proofQuery.requestSuccessful"),
          icon: "success"
        });
      } catch (err) {
        console.log(err);
        let errorRes = await swal.fire({
          title: this.$t("common.error"),
          text: this.$t("proofQuery.noResponse"),
          icon: "error"
        });
      }
    }
  }
};
</script>
<style>
.v-text-field__details {
  display: none;
}
</style>