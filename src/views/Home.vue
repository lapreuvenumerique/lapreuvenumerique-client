<template>
  <v-container fluid style="height: 100%;background:white;">
    <v-row style="height: 100%;">
      <v-col cols="2" style="height: 100%;">
        <v-card class="justify-right" style="height: 100%; width: 100%;">
          <v-navigation-drawer
            absolute
            dark
            src="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg"
            width="100%"
            permanent
          >
            <div style="position: relative; position: -webkit-relative; top:0;">
              <v-list>
                <v-list-item>
                  <v-img
                    max-width="40"
                    max-height="40"
                    class="mr-4 rounded-circle"
                    src="https://alumni.crg.eu/sites/default/files/default_images/default-picture_0_0.png"
                  ></v-img>
                  <span>{{displayName}}</span>
                </v-list-item>
                <v-list-item
                  v-for="item in items"
                  :key="item.title"
                  link
                  @click="setPage(item.label)"
                >
                  <v-list-item-icon>
                    <v-icon>{{ item.icon }}</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </div>
          </v-navigation-drawer>
        </v-card>
      </v-col>
      <v-col cols="10">
        <register-form v-if="this.pageOpened=='settings'" submitMethod="update" :user="user"></register-form>
        <proof-deposit v-if="this.pageOpened=='proofDeposit'"></proof-deposit>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import swal from "sweetalert2";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import dbService from "../service/db-service";
import RegisterForm from "@/components/RegisterForm.vue";
import ProofDeposit from "@/components/ProofDeposit.vue";
import bcrypt from "bcryptjs";
export default {
  icons: {
    iconfont: "md"
  },

  data() {
    return {
      pageOpened: "proofDeposit",
      user: {
        customerUid: "",
        apiKey: ""
      },
      displayName: "",
      items: [
        {
          title: this.$t("home.proofDeposit"),
          icon: "mdi-upload",
          label: "proofDeposit"
        },
        {
          title: this.$t("home.proofSearch"),
          icon: "mdi-file-search",
          label: "proofSearch"
        },
        {
          title: this.$t("home.docVerify"),
          icon: "mdi-file-check",
          label: "docVerify"
        },
        {
          title: this.$t("home.integrity"),
          icon: "mdi-check-circle",
          label: "integrity"
        },
        { title: this.$t("home.settings"), icon: "mdi-cog", label: "settings" }
      ]
    };
  },
  components: {
    RegisterForm,
    ProofDeposit
  },

  async mounted() {
    const res = await dbService.getUserById(this.$store.state.id);
    if (!res) {
      return;
    }
    this.user = res;
    this.user.displayName = res.displayName;
  },
  methods: {
    async setPage(page) {
      if (page == this.pageOpened) return;
      if (this.pageOpened == "settings") {
        const res = await dbService.getUserById(this.$store.state.id);
        if (!res) {
          return;
        }
        this.user = res;
      }
      if (page == "settings") {
        const resPassword = await swal.fire({
          title: this.$t("common.password"),
          text: this.$t("common.enterPassword"),
          input: "password",
          confirmButtonText: "Confirm"
        });
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
    }
  }
};
</script>

<style scoped>
</style>
