<template>
  <v-container fill-height fluid class="back">
    <v-row justify="center" align="center" style="height:'100%';">
      <v-col cols="10">
        <register-form :keyEncryptedApiKey="user.username" :user="user" submitMethod="register"></register-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import RegisterForm from "@/components/RegisterForm.vue";

export default {
  data() {
    return {
      user: {
        customerUid: "",
        apiKey: "",
        username: "",
        email: ""
      }
    };
  },
  components: {
    RegisterForm
  },
  methods: {}
};
</script>
<style scoped>
html,
body {
  height: 100%;
}
#app {
  background: none;
}
.back {
  background-image: url("../assets/clouds.jpg");
  background-size: cover;
}
</style>