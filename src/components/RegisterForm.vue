<template style="font-family: Helvetica;">
  <v-container>
    <v-card class="pa-8">
      <h2 class="mb-5">{{this.$t("home.settings") + " :"}}</h2>
      <v-row>
        <v-col>
          <v-row>
            <v-col cols="4">
              <v-text-field v-model="user.displayName" label="Display name"></v-text-field>
                <v-text-field v-model="user.username" label="Username"></v-text-field>
            </v-col>
            <v-col v-on:vdropzone-success="uploadImage(file)" cols="4">
              <vue-dropzone
                ref="imageDropzone"
                id="dropzone"
                :options="dropzoneOptions"
                :useCustomSlot="true"
                
              >
                <div class="dropzone-custom-content">
                  <h3 class="dropzone-custom-title">{{this.$t("home.dropzoneHeader")}}</h3>
                  <div class="subtitle">{{this.$t("home.dropzoneSubtitle")}}</div>
                </div>
              </vue-dropzone>
            </v-col>
            <v-col cols="4">
              <v-btn
              color="primary"
              @click="updatingPassword = !updatingPassword"
              v-if="!updatingPassword"
              >
                {{this.$t("common.changePassword")}}
              </v-btn>
              <div v-if="this.updatingPassword">
                    <v-text-field
                      v-model="password"
                      :append-icon="passwordeyevalue ? 'mdi-eye' : 'mdi-eye-off'"
                      :rules="passwordRules"
                      :type="passwordeyevalue ? 'password' : 'text'"
                      @click:append="() => (passwordeyevalue = !passwordeyevalue)"
                      :label="this.submitMethod == 'update'? this.$t('home.newPassword'): this.$t('home.password')"
                    ></v-text-field>
                    <v-text-field
                      v-model="confirmPassword"
                      :append-icon="confirmPasswordeyevalue ? 'mdi-eye' : 'mdi-eye-off'"
                      :rules="confirmPasswordRules"
                      :type="confirmPasswordeyevalue ? 'password' : 'text'"
                      @click:append="() => (confirmPasswordeyevalue = !confirmPasswordeyevalue)"
                      :label="this.submitMethod == 'update'? this.$t('home.confirmNewPassword'): this.$t('home.confirmPassword')"
                    ></v-text-field>
                </div>
              <v-btn
              color="primary"
              @click="changePassword(); updatingPassword = !updatingPassword"
              v-if="updatingPassword"
              >
                {{this.$t("common.validatePassword")}}
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <span>
                
                
                <v-alert
                  v-if="this.passwordError"
                  type="error"
                  class="mt-3"
                >{{$t("home.passwordDifferent")}}</v-alert>
                <v-text-field
                  v-model="user.customerUid"
                  :rules="customerUIDRules"
                  :label="this.$t('common.uidLabel')"
                ></v-text-field>
                <v-text-field
                  v-model="user.apiKey"
                  :append-icon="apiKeyeyevalue ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="apiKeyRules"
                  :type="apiKeyeyevalue ? 'password' : 'text'"
                  @click:append="() => (apiKeyeyevalue = !apiKeyeyevalue)"
                  :label="this.$t('common.apiKeyLabel')"
                ></v-text-field>
              </span>
            </v-col>
          </v-row>

          <h4 class="mt-8">{{this.$t("common.togglelist.title")}}</h4>
          <v-row>
            <v-col cols="6">
              <v-row dense>
                <v-col cols="3"></v-col>
                <v-col cols="3">
                  <span>{{this.$t("common.togglelist.available")}}</span>
                </v-col>
                <v-col cols="3">
                  <span>{{this.$t("common.togglelist.required")}}</span>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col cols="6" v-for="toggle in toggles" :key="toggle.title" dense>
              <v-row dense>
                <v-col cols="3">
                  <span class="layout align-center fill-height">{{toggle.title}}</span>
                </v-col>
                <v-col cols="3">
                  <v-switch v-model="toggle.enabled1" inset></v-switch>
                </v-col>
                <v-col cols="3">
                  <v-switch v-if="toggle.enabled1" v-model="toggle.enabled2" inset></v-switch>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="text-right">
          <v-btn @click="register" color="primary">{{$t("register.save")}}</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
<script>
import swal from 'sweetalert2'
import vue2Dropzone from "vue2-dropzone";
import dbService from "../service/db-service";
import bcrypt from "bcryptjs";
export default {
  data() {
    return {
      updatingPassword: false,
      customerUIDRules: [
        value => !!value || this.$t("common.uidRequired"),
        value => value.length == 36 || this.$t("common.uidCount")
      ],
      apiKeyeyevalue: true,
      apiKeyRules: [
        value => !!value || this.$t("common.apiKeyRequired"),
        value => value.length == 64 || this.$t("common.apiKeyCount")
      ],
      passwordeyevalue: true,
      password: "",
      passwordRules: [
        value => !!value || this.$t("common.passwordRequired"),
        value =>
          value.search(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,30})/g) != -1 ||
          this.$t("common.passwordWrong")
      ],
      confirmPasswordeyevalue: true,
      confirmPassword: "",
      passwordError: false,
      confirmPasswordRules: [
        value => !!value || this.$t("common.passwordRequired"),
        value =>
          value.search(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,30})/g) != -1 ||
          this.$t("common.passwordWrong")
      ],
      dropzoneOptions: {
        url: "https://httpbin.org/post",
        thumbnailWidth: 500,
        addRemoveLinks: true,
        maxFiles: 1
      },
      toggles: [
        {
          index: "file",
          title: this.$t("common.togglelist.file"),
          enabled1: false,
          enabled2: false
        },
        {
          index: "fileNumber",
          title: this.$t("common.togglelist.fileNumber"),
          enabled1: false,
          enabled2: false
        },
        {
          index: "reference",
          title: this.$t("common.togglelist.reference"),
          enabled1: false,
          enabled2: false
        },
        {
          index: "uids",
          title: this.$t("common.togglelist.uids"),
          enabled1: false,
          enabled2: false
        },
        {
          index: "copy",
          title: this.$t("common.togglelist.copy"),
          enabled1: false,
          enabled2: false
        },
        {
          index: "identity",
          title: this.$t("common.togglelist.identity"),
          enabled1: false,
          enabled2: false
        },
        {
          index: "batchNumber",
          title: this.$t("common.togglelist.batchNumber"),
          enabled1: false,
          enabled2: false
        },
        {
          index: "topic",
          title: this.$t("common.togglelist.topic"),
          enabled1: false,
          enabled2: false
        },
        {
          index: "rgpdDuration",
          title: this.$t("common.togglelist.rgpdDuration"),
          enabled1: false,
          enabled2: false
        },
        {
          index: "visa",
          title: this.$t("common.togglelist.visa"),
          enabled1: false,
          enabled2: false
        },
        {
          index: "keywords",
          title: this.$t("common.togglelist.keywords"),
          enabled1: false,
          enabled2: false
        },
        {
          index: "okkayId",
          title: this.$t("common.togglelist.okkayId"),
          enabled1: false,
          enabled2: false
        },
        {
          index: "filename",
          title: this.$t("common.togglelist.filename"),
          enabled1: false,
          enabled2: false
        }
      ]
    };
  },
  props: {
    user: Object,
    submitMethod: String
  },
  mounted() {
    this.syncToggles();
  },
  components: {
    vueDropzone: vue2Dropzone
  },
  methods: {
    uploadImage(file) {
      console.log(file);
    },
    async register() {
      if (this.submitMethod == "register") {
        if(this.password != this.confirmPassword) {
          this.passwordError = true;
          return;
        }
      }
      let properties = {};
      for (let i = 0; i < this.toggles.length; i++) {
        let val = 0;
        if (this.toggles[i].enabled1) {
          if (this.toggles[i].enabled2) {
            val = 2;
          } else {
            val = 1;
          }
        }
        properties[this.toggles[i].index] = val;
      }
      if (this.submitMethod == "register") {
        const res = await dbService.register(
          this.user.username,
          await bcrypt.hash(this.confirmPassword, 12),
          this.user.displayName,
          this.user.apiKey,
          this.user.customerUid,
          properties
        );

        if (res.status == "SUCCESS") {
          this.$router.push("/login");
        } else {
          this.errorUsername = true;
        }
      } else {
        const res = await dbService.updateUserById(
          this.$store.state.id,
          this.user.username,
          this.user.displayName,
          this.user.userPicture,
          this.user.apiKey,
          this.user.customerUid,
          properties
        );

        if (res.status == "SUCCESS") {
          swal.fire({title: this.$t("common.saveSuccess"), text: this.$t("common.configChanged"), icon: "success", confirmButtonText:"OK"})
          
        } else {
          this.errorUsername = true;
        }
      }
    },

    async changePassword(){
      const res = await dbService.updatePasswordById(
        this.user.id,
        this.password.trim().length > 0 ? await bcrypt.hash(this.confirmPassword, 12): this.user.password,
      )
      swal.fire({title: this.$t("common.passwordSuccess"), text: this.$t("common.passwordChanged"), icon: "success", confirmButtonText:"OK"})
    },

    syncToggles() {
      let prop = this.user.properties;
      if (!prop) {
        return;
      }
      for (let i = 0; i < this.toggles.length; i++) {
        this.toggles[i].enabled1 =
          prop[this.toggles[i].index] > 0 ? true : false;
        this.toggles[i].enabled2 =
          prop[this.toggles[i].index] == 2 ? true : false;
      }
    },

    resetToggles() {
      for (let s = 0; s < this.toggles.length; s++) {
        this.toggles[s].enabled1 = false;
        this.toggles[s].enabled2 = false;
      }
      console.log("reset");
    }
  }

};
</script>

<style scoped>
body{
  font-family: Arial, Helvetica, sans-serif;
}
.swal2-popup {
  font-family: Helvetica;
}
</style>