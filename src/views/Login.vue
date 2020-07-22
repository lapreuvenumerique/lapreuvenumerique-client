<template>
  <v-container fill-height fluid>
    <v-row justify="center" align="center" style="height:'100%';">
      <v-col cols="4">
        <a href="https://www.lapreuvenumerique.com" target="_blank">
          <v-img
            src="../../build/background.png"
            style="position: absolute; top: 50px; left:50px;"
            width="200px"
          ></v-img
        ></a>
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>{{ this.$t("login.headerInfo") }}</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <v-form v-model="isValid">
              <v-text-field
                v-model="username"
                required
                :rules="usernameRules"
                :label="$t('common.usernameLabel')"
              ></v-text-field>
              <v-text-field
                v-model="password"
                :append-icon="passwordeyevalue ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="passwordRules"
                :type="passwordeyevalue ? 'password' : 'text'"
                @click:append="() => (passwordeyevalue = !passwordeyevalue)"
                :label="$t('common.passwordLabel')"
              ></v-text-field>
              <v-row justify="center">
                <v-col cols="4" class="text-center">
                  <v-alert v-if="errorCredentials" type="error" class="mt-3">{{
                    $t("login.errorCredentials")
                  }}</v-alert>

                  <v-alert v-if="errorServer" type="error" class="mt-3">{{
                    $t("login.errorServer")
                  }}</v-alert>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="gotoRegister()" color="primary">{{
              $t("common.register")
            }}</v-btn>
            <v-spacer></v-spacer>
            <v-btn @click="login" :disabled="!isValid" color="primary">{{
              $t("common.login")
            }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import dbService from "../service/db-service";
export default {
  data() {
    return {
      passwordeyevalue: true,
      errorCredentials: false,
      errorServer: false,
      password: "",
      passwordRules: [(value) => !!value || this.$t("common.passwordRequired")],
      username: "",
      usernameRules: [(value) => !!value || this.$t("common.usernameRequired")],
      isValid: false,
    };
  },
  methods: {
    gotoRegister() {
      this.$router.push("/register");
    },
    async login() {
      const response = await dbService.login(this.username, this.password);
      if (response.status != "FAILED") {
        this.$store.commit("setId", response.user.id);
        const encryptedKey = dbService.getSecretKey();
        const decryptedApi = this.CryptoJS.AES.decrypt(
          response.user.apiKey,
          encryptedKey
        ).toString(this.CryptoJS.enc.Utf8);
        const decryptedUid = this.CryptoJS.AES.decrypt(
          response.user.customerUid,
          encryptedKey
        ).toString(this.CryptoJS.enc.Utf8);
        this.$store.commit("setCredentials", {
          customerUid: decryptedUid,
          apiKey: decryptedApi,
        });
        this.$router.push("/");
      } else {
        this.errorCredentials = true;
      }
    },
  },
};
</script>
