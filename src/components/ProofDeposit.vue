<template>
  <v-container>
    <v-card class="pa-8">
      <h2 class="mb-5">{{this.$t("proofDeposit.proofDeposit")}}</h2>
      <v-row>
        <v-col cols="6">
          <vue-dropzone
            ref="proofDropzone"
            id="dropzone"
            :options="dropzoneOptions"
            :useCustomSlot="true"
            @vdropzone-success="(file, response) => this.uploadProof(file)"
          >
            <div class="dropzone-custom-content">
              <h3 class="dropzone-custom-title">{{this.$t("proofDeposit.uploadProof")}}</h3>
              <div class="subtitle">{{this.$t("proofDeposit.uploadProofSubtitle")}}</div>
            </div>
          </vue-dropzone>
        </v-col>
        <v-col cols="6">
          <v-switch
          inset
          :label="$t('proofDeposit.allowDuplicate')"
          v-model="allowDuplicate"
          >

          </v-switch>
        </v-col>
      </v-row>
      <v-form>
        <v-row>
          <v-col cols="6" v-for="input in inputs" :key="input.title">
            <v-text-field :label="$t(`common.togglelist.${input.title}`)" :rules="input.currentProperty == 2? ['Required']: []" :shaped="input.currentProperty == 2"></v-text-field>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-container>
</template>
<script>
import vue2Dropzone from "vue2-dropzone";
import dbService from "../service/db-service";
export default {
  data() {
    return {
      proofData: String,
      inputs: [],
      dropzoneOptions: {
        url: "https://httpbin.org/post",
        thumbnailWidth: 500,
        addRemoveLinks: true,
        maxFiles: 1
      },
      allowDuplicate: false
    };
  },
  components: {
    vueDropzone: vue2Dropzone
  },
  methods: {
    uploadProof(file) {
      this.proofData = file.dataURL;
    }
  },
  props: {
    user: Object
  },
  async mounted() {
    const dropzone = this.$refs.proofDropzone;
    dropzone.$el.addEventListener("vdropzone-success", $event =>
      this.uploadProof($event)
    );
    let properties = Object.keys(this.user.properties);
    for (let i = 0; i < properties.length; i++) {
      let currentProperty = this.user.properties[properties[i]];
      if (!currentProperty == 0) {
        continue;
      }
      this.inputs.push({
        title: properties[i],
        required: currentProperty == 2
      });
    }
  }
};
</script>