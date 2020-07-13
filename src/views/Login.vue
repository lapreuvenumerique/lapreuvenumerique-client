<template>
    <v-container fill-height fluid>
        <v-row justify="center" align="center" style="height:'100%';">
            <v-col cols="4">
                <v-card class="elevation-12">
              <v-toolbar
                color="primary"
                dark
                flat
              >
                <v-toolbar-title>{{this.$t("login.headerInfo")}}</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form
                v-model="isValid"
                >
                <v-text-field
                   v-model="username"
                   counter="36"
                   required
                   :rules="usernameRules"
                   :label="$t('login.usernameLabel')"
                   maxlength="36"
                ></v-text-field>
                  <v-text-field
                      v-model="password"
                      counter="64"
                      :rules="passwordRules"
                      type="password"
                      :label="$t('login.passwordLabel')"
                      maxlength="64"
                  ></v-text-field>
                    <v-row justify="center">
                        <v-col cols="4" class="text-center">
                            
                            
                            <v-alert
                            v-if="errorCredentials"
                            type="error"
                            class="mt-3"
                            >
                               {{$t("login.errorCredentials")}} 
                            </v-alert>
                            
                            <v-alert
                            v-if="errorServer"
                            type="error"
                            class="mt-3"
                            >
                               {{$t("login.errorServer")}} 
                            </v-alert>
                        </v-col>
                    </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn 
                    @click="login"
                    :disabled="!isValid"
                    color="primary"
                    >
                        {{$t("login.submit")}}
                </v-btn>
              </v-card-actions>
            </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
//import dbService from "../service/db-service"
export default {
    data(){
        return{
            errorCredentials: false,
            errorServer: false,
            password : "Admin123",
            passwordRules:[value => !!value || this.$t("login.passwordRequired")],
            username : "Admin",
            usernameRules:[value => !!value || this.$t("login.usernameRequired")],
            isValid : false
        }
    },
    methods:{
        login(){
            //const response = dbService.login(this.username, this.password)
            //console.log(response)
            //this.$router.push("/")
        }
    }
}
</script>

<style scoped>
    html{
        background: url('../assets/clouds.jpg'); 
        background-size:cover;
    }
    #app{
        background:none;
    }
</style>