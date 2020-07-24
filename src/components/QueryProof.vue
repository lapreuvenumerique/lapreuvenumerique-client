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
            <v-icon class="mdi full-width full-height" color="white" size="60"
              >mdi-database</v-icon
            >
          </v-col>
          <v-col cols="9" class="text-right px-7">
            <span style="font-size:15px; font-weight: 300;">{{
              $t("proofQuery.proofCount")
            }}</span>
            <br />
            <b style="font-size:25px;white-space: nowrap;">{{
              formatNumber(proofCount)
            }}</b>
          </v-col>
        </v-row>
      </v-card>
      <h2 class="mb-10">{{ this.$t("proofDeposit.proofDeposit") }}</h2>
      <h3 class="mt-10 mb-4">{{ this.$t("proofQuery.searchFields") }} :</h3>
      <v-row>
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-header>{{
              $t("common.fields")
            }}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row class="d-flex align-center">
                <v-col
                  cols="6"
                  class="d-flex align-center"
                  v-for="field in fields"
                  :key="field.field"
                >
                  <v-text-field
                    :label="field.title"
                    outlined
                    v-model="field.value"
                    v-if="
                      field.field != 'keywords' &&
                        field.field != 'topic' &&
                        field.field != 'uploadDate'
                    "
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
                    <template
                      v-slot:selection="{ attrs, item, select, selected }"
                    >
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
                  <v-date-picker
                    v-model="field.value"
                    v-if="field.field == 'uploadDate'"
                    width="290"
                    class="mt-4"
                  ></v-date-picker>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-col cols="12" class="text-right">
          <v-btn
            color="primary"
            @click="
              () =>
                getDataFromApi('reset').then((data) => {
                  proofs = data.items;
                  searchProofCount = data.total;
                })
            "
            >{{ $t("common.search") }}</v-btn
          >
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
        hide-default-footer
        class="elevation-1"
        :server-items-length="searchProofCount"
        :expanded.sync="expanded"
        show-expand
        :options.sync="options"
        :search="search"
        :footer-props="footerProps"
        fixed-header
        height="700px"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon
            small
            @click="downloadFile(item.id, item.fileName)"
            class="mr-2"
            >mdi-download</v-icon
          >
          <v-icon
            @click="
              downloadReceipt(item.id, 'receipt-' + item.fileName + '.pdf')
            "
            small
            >mdi-download-lock</v-icon
          >
        </template>
        <template v-slot:item.data-table-expand="{ expand, isExpanded }">
          <v-icon @click="expand(!isExpanded)">mdi-fingerprint</v-icon>
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            {{
              $t("common.togglelist.fingerprint") +
                " : " +
                proofs[proofs.indexOf(item)].fingerprint
            }}
          </td>
        </template>
      </v-data-table>
      <template>
        <div class="text-xs-center">
          <v-pagination
            @input="setPage"
            v-model="queryPage"
            :length="Math.ceil(proofCount / 50)"
            prev-icon="mdi-menu-left"
            next-icon="mdi-menu-right"
          ></v-pagination>
        </div>
      </template>
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
  components: {},
  data() {
    return {
      footerProps: {
        "items-per-page-options": [50],
      },
      expanded: [],
      search: "",
      finishedLoading: false,
      proofCount: 0,
      headers: [
        { text: this.$t("proofQuery.id"), value: "id", sortable: false },
        { text: this.$t("common.togglelist.filename"), value: "fileName" },
        { text: this.$t("common.togglelist.folderName"), value: "folderName" },
        { text: this.$t("common.togglelist.reference"), value: "reference" },
        { text: this.$t("proofQuery.date"), value: "uploadDate" },
        { text: this.$t("common.togglelist.identity"), value: "identity" },
        {
          text: this.$t("common.togglelist.batchNumber"),
          value: "batchNumber",
        },
        { text: this.$t("common.togglelist.topic"), value: "topic" },
        {
          text: this.$t("common.togglelist.deadline"),
          value: "deadline",
        },
        {
          text: this.$t("proofQuery.actions"),
          value: "actions",
          sortable: false,
        },
      ],
      proofs: [],
      topics: [],
      fields: [
        {
          field: "id",
          title: this.$t("common.togglelist.id"),
          value: null,
        },
        {
          field: "fileName",
          title: this.$t("common.togglelist.filename"),
          value: null,
        },
        {
          field: "folderName",
          title: this.$t("common.togglelist.folderName"),
          value: null,
        },
        {
          field: "reference",
          title: this.$t("common.togglelist.reference"),
          value: null,
        },
        {
          field: "identity",
          title: this.$t("common.togglelist.identity"),
          value: null,
        },
        {
          field: "batchNumber",
          title: this.$t("common.togglelist.batchNumber"),
          value: null,
        },
        {
          field: "topic",
          title: this.$t("common.togglelist.topic"),
          value: "",
        },
        {
          field: "deadline",
          title: this.$t("common.togglelist.deadline"),
          value: null,
        },
        {
          field: "keywords",
          title: this.$t("common.togglelist.keywords"),
          value: null,
        },
        {
          field: "fingerprint",
          title: this.$t("common.togglelist.fingerprint"),
          value: null,
        },
        {
          field: "uploadDate",
          title: this.$t("common.togglelist.date"),
          value: null,
        },
      ],
      dataOnSearch: [],
      showLoadMore: false,
      queryPage: 1,
      options: {
        pagination: this.queryPage,
      },
      searchProofCount: 0,
    };
  },
  mounted() {
    this.loadProofCount();
    this.loadTopics();
  },
  watch: {
    options: {
      handler() {
        if (this.dataOnSearch == this.fields) {
          this.getDataFromApi().then((data) => {
            this.proofs = data.items;
            this.searchProofCount = data.total;
          });
        }
      },
      deep: true,
    },
  },
  methods: {
    setPage(page) {
      this.queryPage = page;
      this.getDataFromApi().then((data) => {
        this.proofs = data.items;
        this.searchProofCount = data.total;
      });
    },
    async getDataFromApi(method) {
      let queryPage = 1;
      if (method != "reset") {
        queryPage = this.queryPage;
      } else {
        this.queryPage = 1;
      }
      this.loading = true;
      const { page, itemsPerPage } = this.options;

      let waitAlert = swal.fire({
        title: this.$t("common.wait"),
        text: this.$t("proofQuery.searchingDB"),
        icon: "info",
        showConfirmButton: false,
        allowOutsideClick: false,
      });
      let data = {};
      for (let i = 0; i < this.fields.length; i++) {
        const value = this.fields[i].value;
        if (value) {
          data[this.fields[i].field] = value;
        }
      }
      data["page"] = queryPage;
      try {
        const res = await clientService.getQuery(data);
        if (res.data?.files[0].proofCount) {
          this.proofCount = parseInt(res.data.files[0].proofCount);
        } else {
          await this.loadProofCount();
        }
        waitAlert.close();
        this.dataOnSearch = this.fields;
        this.user = res;
        this.proofs = res.data.files;
        for (let i = 0; i < this.proofs.length; i++) {
          this.proofs[i].uploadDate = moment(this.proofs[i].uploadDate).format(
            "L"
          );
          this.proofs[i].deadline = moment(this.proofs[i].deadline).format("L");
        }
        let items = this.proofs;
        const total = this.proofCount;
        return {
          items,
          total,
        };
      } catch (err) {
        console.log(err);
        switch (err.response?.status) {
          case 400: {
          }
          default: {
            let errorRes = await swal.fire({
              title: this.$t("common.error"),
              text: this.$t("common.serverError"),
              icon: "error",
            });
            return;
          }
        }
      }
    },
    async loadTopics() {
      try {
        const res = await clientService.getTopics();
        this.topics.push("");
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
        this.proofCount = parseInt(res.data.number, 10);
      } catch (err) {
        console.log(err);
      }
    },
    formatNumber(number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },
  },
};
</script>
<style>
.v-text-field__details {
  display: none;
}
tbody tr:nth-of-type(even) {
  background-color: rgba(255, 255, 255, 0.5);
}
</style>
