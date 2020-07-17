<template>
  <v-container>
    <v-row>
      <v-col cols="10" md="10" sm="7"></v-col>
      <v-col cols="2" md="2" sm="5">
        <v-card class="lighten-1 white--text green" align="right" style="position: absolute; z-index: 5">
          <v-row align="center" justify="center">
            <v-col cols="3" class="text-left px-7">
              <v-icon class="mdi full-width full-height" color="white" size="60">mdi-database</v-icon>
            </v-col>
            <v-col cols="9" class="text-right px-7">
              <span style="font-size:15px; font-weight: 300;">Proof count :</span>
              <br />
              <b style="font-size:25px;">{{proofCount}}</b>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-card class="pa-8">
      <h2 class="mb-5">{{this.$t("proofDeposit.proofDeposit")}}</h2>
      <v-row>
        <v-col cols="3" class="d-flex align-center">
          <v-select :items="headersSelect" label="Field" v-model="field" dense outlined></v-select>
        </v-col>
        <v-col cols="3" class="d-flex align-center">
          <v-text-field label="Value" outlined v-model="value" v-if="field != 'keywords'" dense></v-text-field>
          <v-combobox
            v-model="value"
            chips
            clearable
            multiple
            solo
            append-icon="mdi-magnify"
            v-if="field == 'keywords'"
          >
            <template v-slot:selection="{ attrs, item, select, selected }">
              <v-chip
                v-bind="attrs"
                :input-value="selected"
                close
                @click="select"
                @click:close="remove(value, item)"
              >
                <strong>{{ item }}</strong>
              </v-chip>
            </template>
          </v-combobox>
        </v-col>
        <v-col cols="3" class>
          <v-btn color="primary" @click="searchQuery(field, value)">{{$t("common.search")}}</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4">
          <v-text-field
            append-icon="mdi-magnify"
            single-line
            hide-details
            label="Search in values"
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
          <v-icon small>mdi-download-lock</v-icon>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
<script>
import clientService from "@/service/client-service";
import swal from "sweetalert2";
import fileDownload from "js-file-download";
import moment from "moment"
export default {
  data() {
    return {
      field: "",
      value: "",
      search: "",
      finishedLoading: false,
      proofCount: 0,
      headers: [
        { text: "ID", value: "id" },
        { text: "File name", value: "filename" },
        { text: "Folder name", value: "foldername" },
        { text: "Reference", value: "reference" },
        { text: "UIDs", value: "uids" },
        { text: "Identity", value: "identity" },
        { text: "Batch number", value: "batchnumber" },
        { text: "Topic", value: "topic" },
        { text: "RGPD duration", value: "rgpdduration" },
        { text: "Keywords", value: "keywords" },
        { text: "Upload date", value: "uploaddate" },
        { text: "Fingerprint", value: "fingerprint" },
        { text: "Actions", value: "actions", sortable: false }
      ],
      headersSelect: [
        { text: "ID", value: "id" },
        { text: "File name", value: "filename" },
        { text: "Folder name", value: "foldername" },
        { text: "Reference", value: "reference" },
        { text: "UIDs", value: "uids" },
        { text: "Identity", value: "identity" },
        { text: "Batch number", value: "batchnumber" },
        { text: "Topic", value: "topic" },
        { text: "RGPD duration", value: "rgpdduration" },
        { text: "Keywords", value: "keywords" },
        { text: "Upload date", value: "uploaddate" },
        { text: "Fingerprint", value: "fingerprint" }
      ],
      proofs: []
    };
  },
  mounted() {
    this.loadProofCount();
  },
  methods: {
    remove(value, item) {
      value.splice(value.indexOf(item), 1);
      value = [...value];
    },
    async downloadFile(id, name) {
      const res = await clientService.downloadProof(id);
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
    async searchQuery(field, value) {
      let waitAlert = swal.fire({
        title: this.$t("common.wait"),
        text: this.$t("common.uploadingData"),
        icon: "info",
        showConfirmButton: false,
        allowOutsideClick: false
      });
      try {
        const res = await clientService.getQuery({ field, value });
        this.proofs = res.data.files;
        for(let i = 0; i < this.proofs.length; i ++){
          this.proofs[i].uploaddate = moment(this.proofs[i].uploaddate).format("L")
          console.log(this.proofs[i].uploaddate)
        }
        let successRes = await swal.fire({
          title: this.$t("common.success"),
          text: this.$t("common.dataUploaded"),
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