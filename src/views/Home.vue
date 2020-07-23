<template>
  <v-container fluid style="height: 100%;background:white;" class="pa-0">
    <v-row style="height: 100%;" class="pa-0">
      <v-col cols="2" style="height: 100%;" class="pa-0">
        <v-card style="width: 100%; height: 100%; left: 0px; up: 0px;">
          <v-navigation-drawer
            dark
            style="width: 100%; left: 0px; up: 0px;"
            class="pa-0"
            permanent
          >
            <div style="position: relative; position: -webkit-relative; top:0;" width="100%">
              <v-list width="100%">
                <div style="top: 10px;right: 10px">
                  <v-btn
                    style="position:absolute;top:14px;right:25px;z-index: 50"
                    @click="$router.push('/login')"
                  >
                    <v-icon class="mdi">mdi-logout</v-icon>
                  </v-btn>
                </div>
                <v-list-item>
                  <v-img
                    max-width="40"
                    max-height="40"
                    class="mr-4 rounded-circle"
                    :src="userPicture"
                  ></v-img>
                  <span>{{ this.user.displayName }}</span>
                </v-list-item>

                <v-list-item
                  v-for="item in items"
                  :key="item.title"
                  link
                  @click="setPage(item.label)"
                >
                  <v-list-item-icon class="mr-2">
                    <v-icon class="mdi">{{ item.icon }}</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content class="ml-2">
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item
                  href="https://www.lapreuvenumerique.com"
                  target="_blank"
                  link
                  style="bottom: 20px; position:absolute; right:0; left:0;"
                  width="100%"
                >
                  <v-list-item-icon class="mr-2">
                    <v-icon> mdi-open-in-new </v-icon>
                  </v-list-item-icon>

                  <v-list-item-content class="ml-2">
                    <v-list-item-title>{{
                      $t("home.website")
                    }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <b
                  style="position:absolute;bottom: 10px;right: 15px;font-size:10px"
                  >v{{ version }}</b
                >
              </v-list>
            </div>
          </v-navigation-drawer>
        </v-card>
      </v-col>
      <v-col cols="10" :key="keyReload">
        <proof-deposit
          v-if="this.pageOpened == 'proofDeposit'"
          :user="user"
          v-on:reset="reset"
        ></proof-deposit>
        <mass-deposit
          v-if="this.pageOpened == 'massDeposit'"
          :user="user"
          v-on:reset="reset"
        ></mass-deposit>
        <integrity v-if="this.pageOpened == 'integrity'"></integrity>
        <verify-file-existence
          v-if="this.pageOpened == 'docVerify'"
          v-on:reset="reset"
        ></verify-file-existence>
        <query-proof v-if="this.pageOpened == 'proofSearch'"></query-proof>
        <register-form
          v-if="this.pageOpened == 'settings'"
          submitMethod="update"
          :user="user"
          v-on:reset="reset"
        ></register-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import swal from "sweetalert2";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import dbService from "../service/db-service";
import RegisterForm from "@/components/RegisterForm.vue";
import ProofDeposit from "@/components/ProofDeposit.vue";
import Integrity from "@/components/Integrity";
import clientService from "@/service/client-service";
import VerifyFileExistence from "@/components/VerifyFileExistence";
import QueryProof from "@/components/QueryProof.vue";
import * as cfg from "../config";
import MassDeposit from "@/components/MassDeposit";
import bcrypt from "bcryptjs";
import VueCryptojs from "vue-cryptojs";
export default {
  icons: {
    iconfont: "md",
  },

  data() {
    return {
      keyReload: 0,
      pageOpened: "",
      userPicture:
        "https://alumni.crg.eu/sites/default/files/default_images/default-picture_0_0.png",
      user: {
        customerUid: "",
        apiKey: "",
      },
      displayName: "",
      items: [
        {
          title: this.$t("home.proofDeposit"),
          icon: "mdi-upload",
          label: "proofDeposit",
        },
        {
          title: this.$t("home.massDeposit"),
          icon: "mdi-upload-multiple",
          label: "massDeposit",
        },
        {
          title: this.$t("home.proofSearch"),
          icon: "mdi-file-search",
          label: "proofSearch",
        },
        {
          title: this.$t("home.docVerify"),
          icon: "mdi-file-check",
          label: "docVerify",
        },
        {
          title: this.$t("home.integrity"),
          icon: "mdi-check-circle",
          label: "integrity",
        },
        { title: this.$t("home.settings"), icon: "mdi-cog", label: "settings" },
      ],
      credits: 0,
      version: "",
    };
  },
  components: {
    RegisterForm,
    ProofDeposit,
    Integrity,
    VerifyFileExistence,
    QueryProof,
    MassDeposit,
  },

  async mounted() {
    this.version = cfg.getAppVersion();
    const res = await dbService.getUserById(this.$store.state.id);
    if (!res) {
      return;
    }
    this.user = res;
    this.user.displayName = res.displayName;
    if (res.userPicture) {
      this.userPicture = res.userPicture;
      this.user.userPicture = res.userPicture;
    }
    this.pageOpened = "proofDeposit";
    this.updateCredits();
  },
  methods: {
    reset() {
      this.keyReload++;
    },
    async updateCredits() {
      const credit = await clientService.getCredits();
      this.credits = credit.data.credits;
    },
    async setPage(page) {
      if (page == this.pageOpened) return;
      const res = await dbService.getUserById(this.$store.state.id);
      if (this.pageOpened == "settings") {
        const encryptedKey = dbService.getSecretKey();
        const decryptedCustomer = this.CryptoJS.AES.decrypt(
          res.customerUid,
          encryptedKey
        ).toString(this.CryptoJS.enc.Utf8);
        const decryptedApiKey = this.CryptoJS.AES.decrypt(
          res.apiKey,
          encryptedKey
        ).toString(this.CryptoJS.enc.Utf8);

        const newres = JSON.stringify(res.properties);

        const oldres = JSON.stringify(this.user.properties);
        if (
          res.username != this.user.username ||
          res.displayName != this.user.displayName ||
          decryptedCustomer != this.user.customerUid ||
          decryptedApiKey != this.user.apiKey ||
          res.noDuplicate != this.user.noDuplicate ||
          res.keepFiles != this.user.keepFiles ||
          res.userPicture != this.user.userPicture ||
          newres != oldres
        ) {
          const resExit = await swal.fire({
            title: this.$t("common.exit"),
            text: this.$t("common.exitAbandonUnsavedChanges"),
            confirmButtonText: this.$t("common.confirm"),
            showCancelButton: true,
            cancelButtonText: this.$t("common.cancel"),
          });
          if (!resExit.isConfirmed) {
            return;
          }
        }
        if (!res) {
          return;
        }
        this.user = res;
        if (res.userPicture) {
          this.userPicture = res.userPicture;
        }
      }
      if (page == "settings") {
        const resPassword = await swal.fire({
          title: this.$t("common.password"),
          text: this.$t("common.enterPassword"),
          input: "password",
          confirmButtonText: this.$t("common.confirm"),
          showCancelButton: true,
          cancelButtonText: this.$t("common.cancel"),
        });
        if (!resPassword.isConfirmed) {
          return;
        }
        if (!(await bcrypt.compare(resPassword.value, this.user.password))) {
          swal.fire({
            icon: "error",
            title: this.$t("common.password"),
            text: this.$t("common.notCorrespondingPassword"),
          });
          return;
        }
      }
      this.pageOpened = page;
    },
  },
};
</script>

<style scoped>
.swal2-popup {
  font-family: Helvetica;
}
</style>
