<template style="font-family: Helvetica;">
  <v-container>
    <v-card class="pa-8">
      <h2
        class="mb-5"
      >{{submitMethod == 'update'? this.$t("home.settings"): this.$t("common.register") + " :"}}</h2>

      <v-row>
        <v-col>
          <v-row>
            <v-col :cols="submitMethod == 'update'? 4: 6">
              <v-form v-model="isValid">
                <v-text-field
                  v-model="user.displayName"
                  :label="$t('common.displayNameLabel')"
                  required
                  outlined
                  autofocus
                ></v-text-field>
                <v-text-field
                  v-model="user.username"
                  :label="$t('common.usernameLabel')"
                  required
                  outlined
                ></v-text-field>
              </v-form>
            </v-col>
            <v-col
              v-on:vdropzone-success="uploadImage(file)"
              :cols="submitMethod == 'update'? 4: 6"
            >
              <vue-dropzone
                ref="imageDropzone"
                id="dropzone"
                :options="dropzoneOptions"
                :useCustomSlot="true"
                @vdropzone-success="(file, response) => this.uploadImage(file)"
              >
                <div class="dropzone-custom-content">
                  <h3 class="dropzone-custom-title">{{this.$t("home.dropzoneHeader")}}</h3>
                  <div class="subtitle">{{this.$t("home.dropzoneSubtitle")}}</div>
                </div>
              </vue-dropzone>
            </v-col>
            <v-col cols="4" v-if="this.submitMethod == 'update'">
              <v-text-field
                v-model="password"
                :append-icon="passwordeyevalue ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="passwordRules"
                :type="passwordeyevalue ? 'password' : 'text'"
                @click:append="() => (passwordeyevalue = !passwordeyevalue)"
                :label="this.$t('home.newPassword')"
              ></v-text-field>
              <v-text-field
                v-model="confirmPassword"
                :append-icon="confirmPasswordeyevalue ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="confirmPasswordRules"
                :type="confirmPasswordeyevalue ? 'password' : 'text'"
                @click:append="() => (confirmPasswordeyevalue = !confirmPasswordeyevalue)"
                :label="this.$t('home.confirmNewPassword')"
              ></v-text-field>
              <v-btn
                color="primary"
                @click="changePassword();"
              >{{this.$t("common.validatePassword")}}</v-btn>
            </v-col>
          </v-row>
          <v-form v-model="isValid2">
            <v-row>
              <v-col>
                <span>
                  <v-text-field
                    v-model="user.email"
                    :type="email"
                    :label="this.$t('common.email')"
                    required
                    outlined
                  ></v-text-field>
                  <v-text-field
                    outlined
                    v-if="this.submitMethod == 'register'"
                    v-model="password"
                    :append-icon="passwordeyevalue ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="passwordRules"
                    :type="passwordeyevalue ? 'password' : 'text'"
                    @click:append="() => (passwordeyevalue = !passwordeyevalue)"
                    :label="this.$t('home.password')"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-if="this.submitMethod == 'register'"
                    v-model="confirmPassword"
                    :append-icon="confirmPasswordeyevalue ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="confirmPasswordRules"
                    :type="confirmPasswordeyevalue ? 'password' : 'text'"
                    @click:append="() => (confirmPasswordeyevalue = !confirmPasswordeyevalue)"
                    :label="this.$t('home.confirmPassword')"
                    required
                    outlined
                  ></v-text-field>
                  <v-alert
                    v-if="this.passwordError"
                    type="error"
                    class="mt-3"
                  >{{$t("home.passwordDifferent")}}</v-alert>
                  <v-text-field
                    v-model="user.customerUid"
                    outlined
                    :rules="customerUIDRules"
                    required
                    :label="this.$t('common.uidLabel')"
                  ></v-text-field>
                  <v-text-field
                    v-model="user.apiKey"
                    :append-icon="apiKeyeyevalue ? 'mdi-eye' : 'mdi-eye-off'"
                    outlined
                    :rules="apiKeyRules"
                    required
                    :type="apiKeyeyevalue ? 'password' : 'text'"
                    @click:append="() => (apiKeyeyevalue = !apiKeyeyevalue)"
                    :label="this.$t('common.apiKeyLabel')"
                  ></v-text-field>
                </span>
                <v-switch inset :label="$t('proofDeposit.noDuplicate')" v-model="user.noDuplicate"></v-switch>
                <v-switch inset :label="$t('proofDeposit.keepFiles')" v-model="user.keepFiles"></v-switch>
              </v-col>
            </v-row>

            <h4 class="mt-8">{{this.$t("common.togglelist.title")}}</h4>
            <v-row>
              <v-col cols="6">
                <v-row dense>
                  <v-col cols="3"></v-col>
                  <v-col cols="3" class="text-center">
                    <span>{{this.$t("common.togglelist.available")}}</span>
                  </v-col>
                  <v-col cols="3" class="text-center">
                    <span>{{this.$t("common.togglelist.required")}}</span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="6">
                <v-row dense>
                  <v-col cols="3"></v-col>
                  <v-col cols="3" class="text-center">
                    <span>{{this.$t("common.togglelist.available")}}</span>
                  </v-col>
                  <v-col cols="3" class="text-center">
                    <span>{{this.$t("common.togglelist.required")}}</span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row dense no-gutters class="ma-0">
              <v-col cols="6" v-for="toggle in toggles" :key="toggle.title" dense>
                <v-row dense no-gutters class="ma-0">
                  <v-col cols="3">
                    <span class="layout align-center fill-height">{{toggle.title}}</span>
                  </v-col>
                  <v-col cols="3" class="d-flex justify-center">
                    <v-switch v-model="toggle.enabled1" class="ma-0 layout" inset></v-switch>
                  </v-col>
                  <v-col cols="3" class="d-flex justify-center">
                    <v-switch
                      v-if="toggle.enabled1"
                      v-model="toggle.enabled2"
                      inset
                      class="ma-0 layout"
                    ></v-switch>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-form>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn
            @click="$router.push('/login')"
            color="primary"
            v-if="submitMethod== 'register'"
          >{{ $t("common.cancel")}}</v-btn>
        </v-col>
        <v-col class="text-right">
          <v-btn
            @click="register"
            color="primary"
          >{{ this.submitMethod== "register"? $t("common.register"):$t("register.save")}}</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
<script>
import swal from "sweetalert2";
import vue2Dropzone from "vue2-dropzone";
import dbService from "../service/db-service";
import bcrypt from "bcryptjs";
import VueCryptojs from "vue-cryptojs";
export default {
  data() {
    return {
      email: "",
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
        value => !!value || this.$t("common.uidRequired"),
        value =>
          value.search(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,30})/g) != -1 ||
          this.$t("common.passwordWrong")
      ],
      confirmPasswordeyevalue: true,
      confirmPassword: "",
      passwordError: false,
      confirmPasswordRules: [
        value => !!value || this.$t("common.uidRequired"),
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
          index: "folderName",
          title: this.$t("common.togglelist.folderName"),
          enabled1: true,
          enabled2: false
        },
        {
          index: "reference",
          title: this.$t("common.togglelist.reference"),
          enabled1: true,
          enabled2: false
        },
        {
          index: "copy",
          title: this.$t("common.togglelist.copy"),
          enabled1: true,
          enabled2: false
        },
        {
          index: "batchNumber",
          title: this.$t("common.togglelist.batchNumber"),
          enabled1: true,
          enabled2: false
        },
        {
          index: "topic",
          title: this.$t("common.togglelist.topic"),
          enabled1: true,
          enabled2: false
        },
        {
          index: "rgpdDuration",
          title: this.$t("common.togglelist.rgpdDuration"),
          enabled1: true,
          enabled2: false
        },
        {
          index: "keywords",
          title: this.$t("common.togglelist.keywords"),
          enabled1: true,
          enabled2: false
        }
      ],
      isValid: false,
      isValid2: false
    };
  },
  props: {
    user: Object,
    submitMethod: String
  },
  async mounted() {
    this.user.noDuplicate = false;
    this.user.keepFiles = true;
    this.syncToggles();
    const dropzone = this.$refs.imageDropzone;
    dropzone.$el.addEventListener("vdropzone-success", $event =>
      this.uploadImage($event)
    );
    if (this.submitMethod == "update") {
      const encryptedKey = dbService.getSecretKey();
      const decryptedApi = this.CryptoJS.AES.decrypt(
        this.user.apiKey,
        encryptedKey
      ).toString(this.CryptoJS.enc.Utf8);
      this.user.apiKey = decryptedApi;
      const decryptedCustomer = this.CryptoJS.AES.decrypt(
        this.user.customerUid,
        encryptedKey
      ).toString(this.CryptoJS.enc.Utf8);
      this.user.customerUid = decryptedCustomer;
    }
  },
  components: {
    vueDropzone: vue2Dropzone
  },
  methods: {
    uploadImage(file) {
      this.user.userPicture = file.dataURL;
    },
    async register() {
      if (this.isValid && this.isValid2) {
        if (this.submitMethod == "register") {
          if (this.password != this.confirmPassword) {
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

        let waitAlert = swal.fire({
          title: this.$t("common.wait"),
          text: this.$t("common.uploadingData"),
          icon: "info",
          showConfirmButton: false,
          allowOutsideClick: false
        });
        if (this.submitMethod == "register") {
          const encryptedKey = dbService.getSecretKey();
          const encryptedApiKey = this.CryptoJS.AES.encrypt(
            this.user.apiKey,
            encryptedKey
          ).toString();
          const encryptedCustomer = this.CryptoJS.AES.encrypt(
            this.user.customerUid,
            encryptedKey
          ).toString();
          const res = await dbService.register(
            this.user.username,
            await bcrypt.hash(this.confirmPassword, 12),
            this.user.displayName,
            encryptedApiKey,
            encryptedCustomer,
            properties,
            this.user.userPicture,
            this.user.email,
            this.user.noDuplicate,
            this.user.keepFiles
          );
          let successAlert = swal.fire({
            title: this.$t("common.success"),
            text: this.$t("register.accountCreated"),
            icon: "success",
            showConfirmButton: true
          });
          if (res.status == "SUCCESS") {
            this.$router.push("/login");
          } else {
            this.errorUsername = true;
          }
        } else {
          const encryptedKey = dbService.getSecretKey();
          const encryptedApiKey = this.CryptoJS.AES.encrypt(
            this.user.apiKey,
            encryptedKey
          ).toString();
          const encryptedCustomer = this.CryptoJS.AES.encrypt(
            this.user.customerUid,
            encryptedKey
          ).toString();
          const res = await dbService.updateUserById(
            this.$store.state.id,
            this.user.username,
            this.user.displayName,
            encryptedApiKey,
            encryptedCustomer,
            properties,
            this.user.userPicture,
            this.user.email,
            this.user.noDuplicate,
            this.user.keepFiles
          );

          if (res.status == "SUCCESS") {
            swal.fire({
              title: this.$t("common.saveSuccess"),
              text: this.$t("common.configChanged"),
              icon: "success",
              confirmButtonText: "OK"
            });
          } else {
            this.errorUsername = true;
          }
        }
      }
    },

    async changePassword() {
      if (this.password != this.confirmPassword) {
        swal.fire({
          title: this.$t("common.passwordDifferentTitle"),
          text: this.$t("common.passwordDifferent"),
          icon: "error",
          confirmButtonText: "OK"
        });
        return;
      }
      try {
        const res = await dbService.updatePasswordById(
          this.user.id,
          this.password.trim().length > 0 &&
            this.confirmPassword.trim().length > 0
            ? await bcrypt.hash(this.confirmPassword, 12)
            : this.user.password
        );

        swal.fire({
          title: this.$t("common.passwordSuccess"),
          text: this.$t("common.passwordChanged"),
          icon: "success",
          confirmButtonText: "OK"
        });
      } catch (err) {}
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
    }
  }
};
</script>

<style>
.swal2-container,
.swal2-center,
.swal2-backdrop-show,
.swal2-popup,
.swal2-modal,
.swal2-show {
  font-family: Arial, Helvetica, sans-serif;
}
</style>

<style scoped>
.v-input--selection-controls__input div {
  color: #ff6666;
}
</style>