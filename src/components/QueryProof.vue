<template>
  <v-container>
    <v-row align="center">
      <v-col cols="3" class="d-flex align-center">
        <v-select :items="headersSelect" label="Field" v-model="field" outlined></v-select>
      </v-col>
      <v-col cols="3">
        <v-text-field label="Value" outlined v-model="value"
              v-if="field != 'keywords'"></v-text-field>
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
      <v-col cols="3">
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
  </v-container>
</template>
<script>
import clientService from "@/service/client-service";
import swal from "sweetalert2";
import fileDownload from "js-file-download";
export default {
  data() {
    return {
      field: "",
      value: "",
      search: "",
      finishedLoading: false,
      headers: [
        {
          text: "",
          align: "start",
          sortable: true,
          value: "name"
        },
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
  mounted() {},
  methods: {
    remove(value, item) {
      value.splice(value.indexOf(item), 1);
      value = [...value];
    },
    async downloadFile(id, name) {
      const res = await clientService.downloadProof(id);
      console.log(res);
      fileDownload(res.data, name);
    },
    async searchQuery(field, value) {
      console.log(field);
      console.log(value);
      let waitAlert = swal.fire({
        title: this.$t("common.wait"),
        text: this.$t("common.uploadingData"),
        icon: "info",
        showConfirmButton: false,
        allowOutsideClick: false
      });
      try {
        const res = await clientService.getQuery({ field, value });
        console.log(res);
        this.proofs = res.data.files;
        console.log(res);
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