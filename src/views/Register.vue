<template>
<v-container fill-height fluid class="back">
        <v-row justify="center" align="center" style="height:'100%';">
            <v-col cols="5">
             <v-card class="elevation-12">
              <v-toolbar
                color="primary"
                dark
                flat
              >
                <v-toolbar-title style="word-wrap: break-word;">{{this.$t("register.headerInfo")}}</v-toolbar-title>
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
                   :label="$t('common.usernameLabel')"
                   maxlength="36"
                ></v-text-field>
                  <v-text-field
                      v-model="password"
                      counter="64"
                      :append-icon="passwordeyevalue ? 'mdi-eye' : 'mdi-eye-off'"
                      :rules="passwordRules"
                      :type="passwordeyevalue ? 'password' : 'text'"
                      @click:append="() => (passwordeyevalue = !passwordeyevalue)"
                      :label="$t('common.passwordLabel')"
                      maxlength="64"
                  ></v-text-field>
                  <v-text-field
                      v-model="customerUID"
                      counter="36"
                      required
                      :rules="customerUIDRules"
                      :label="$t('common.uidLabel')"
                      maxlength="36"
                  ></v-text-field>
                  <v-text-field
                      v-model="apiKey"
                      counter="64"
                      :append-icon="apiKeyeyevalue ? 'mdi-eye' : 'mdi-eye-off'"
                      :rules="apiKeyRules"
                      :type="apiKeyeyevalue ? 'password' : 'text'"
                      @click:append="() => (apiKeyeyevalue = !apiKeyeyevalue)"
                      :label="$t('common.apiKeyLabel')"
                      maxlength="64"
                  ></v-text-field>
                    <v-row justify="center">
                        <v-col cols="4" class="text-center">
                            
                            
                            <v-alert
                            v-if="errorKeys"
                            type="error"
                            class="mt-3"
                            >
                               {{$t("register.errorKeys")}} 
                            </v-alert>
                            
                            <v-alert
                            v-if="errorServer"
                            type="error"
                            class="mt-3"
                            >
                               {{$t("register.errorServer")}} 
                            </v-alert>
                        </v-col>
                    </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn 
                    @click="register"
                    :disabled="!isValid"
                    color="primary"
                    >
                        {{$t("common.submit")}}
                </v-btn>
              </v-card-actions>
            </v-card>
            </v-col>
            <v-col cols="4">
                <v-card class="elevation-12">
                    <v-toolbar
                      color="primary"
                      dark
                      flat
                    >
                      <v-toolbar-title style="word-wrap: break-word;">{{this.$t("register.permissionsInfo")}}</v-toolbar-title>
                      <v-spacer></v-spacer>
                    </v-toolbar>
                    <v-card-text >
                        <v-row
                        v-for="toggle in toggles"
                        :key="toggle.index"
                        link
                        dense
                        >
                            <v-col cols="4" dense>
                                <span class="layout align-center justify-center fill-height">{{toggle.title}}</span>
                            </v-col>
                            <v-col cols="4">
                                <v-switch
                                    :label=toggle.label1
                                    v-model= toggle.enabled1
                                    inset
                                    dense
                                ></v-switch>
                            </v-col>
                            <v-col cols="4">
                                <v-switch
                                    :label=toggle.label2
                                    v-if= toggle.enabled1
                                    v-model= toggle.enabled2
                                    inset
                                    dense
                                ></v-switch>
                            </v-col>
                        </v-row>
                    </v-card-text>
                    <v-card-actions dense>
                        <v-btn 
                        @click="resetToggles"
                        color="primary"
                        >
                                {{$t("common.reset")}}
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn 
                        @click="saveToggles"
                        color="primary"
                        >
                                {{$t("common.save")}}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
            
        </v-row>
    </v-container>
</template>

<script>
import servicesFactory from "../service/service-factory"
//import dbService from "../service/db-service"
export default {
    data(){
        return{
            errorKeys:false,
            errorServer: false,
            passwordeyevalue : true,
            secretKeyeyevalue:true,
            apiKeyeyevalue:true,
            username : "Admin",
            usernameRules:[value => !!value || this.$t("common.usernameRequired"),value => value.length > 4  || this.$t("common.usernameCount")],
            password : "Admin123",
            passwordRules:[value => !!value || this.$t("common.passwordRequired"), value => value.search(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,30})/g) != -1  || this.$t("common.passwordWrong")],
            apiKey : "84816873e95047d2a02853421a1d21deb133680b812378a82e7c32d8fdea4960",
            apiKeyRules:[value => !!value || this.$t("common.apiKeyRequired"),value => value.length == 64  || this.$t("common.apiKeyCount")],
            customerUID : "3b462174-7bc9-445f-b746-83decc854d92",
            customerUIDRules:[value => !!value || this.$t("common.uidRequired"), value => value.length == 36 || this.$t("common.uidCount")],
            isValid : false,

           toggles: [
          {index : 1, title : this.$t("common.togglelist.line1.title"), label1 : this.$t("common.togglelist.label1"),  label2 : this.$t("common.togglelist.label2"), enabled1 : false, enabled2 : false},
          {index : 2, title : this.$t("common.togglelist.line2.title"), label1 : this.$t("common.togglelist.label1"),  label2 : this.$t("common.togglelist.label2"), enabled1 : false, enabled2 : false},
          {index : 3, title : this.$t("common.togglelist.line3.title"), label1 : this.$t("common.togglelist.label1"),  label2 : this.$t("common.togglelist.label2"), enabled1 : false, enabled2 : false},
          {index : 4, title : this.$t("common.togglelist.line4.title"), label1 : this.$t("common.togglelist.label1"),  label2 : this.$t("common.togglelist.label2"), enabled1 : false, enabled2 : false},
          {index : 5, title : this.$t("common.togglelist.line5.title"), label1 : this.$t("common.togglelist.label1"),  label2 : this.$t("common.togglelist.label2"), enabled1 : false, enabled2 : false},
          {index : 6, title : this.$t("common.togglelist.line6.title"), label1 : this.$t("common.togglelist.label1"),  label2 : this.$t("common.togglelist.label2"), enabled1 : false, enabled2 : false},
          {index : 7, title : this.$t("common.togglelist.line7.title"), label1 : this.$t("common.togglelist.label1"),  label2 : this.$t("common.togglelist.label2"), enabled1 : false, enabled2 : false},
          {index : 8, title : this.$t("common.togglelist.line8.title"), label1 : this.$t("common.togglelist.label1"),  label2 : this.$t("common.togglelist.label2"), enabled1 : false, enabled2 : false},
          {index : 9, title : this.$t("common.togglelist.line9.title"), label1 : this.$t("common.togglelist.label1"),  label2 : this.$t("common.togglelist.label2"), enabled1 : false, enabled2 : false},
          {index : 10, title : this.$t("common.togglelist.line10.title"), label1 : this.$t("common.togglelist.label1"),  label2 : this.$t("common.togglelist.label2"), enabled1 : false, enabled2 : false},
          {index : 11, title : this.$t("common.togglelist.line11.title"), label1 : this.$t("common.togglelist.label1"),  label2 : this.$t("common.togglelist.label2"), enabled1 : false, enabled2 : false},
          {index : 12, title : this.$t("common.togglelist.line12.title"), label1 : this.$t("common.togglelist.label1"),  label2 : this.$t("common.togglelist.label2"), enabled1 : false, enabled2 : false},
          {index : 13, title : this.$t("common.togglelist.line13.title"), label1 : this.$t("common.togglelist.label1"),  label2 : this.$t("common.togglelist.label2"), enabled1 : false, enabled2 : false}
        ],
        }
    },
    methods:{
        async register(){

            //localStorage.setItem("apiKey", this.apiKey)
            //localStorage.setItem("customerUID", this.customerUID)
            //dbService.register()
            try{
                
                const response = await servicesFactory.getClientService().register()
                console.log(response)
                this.$store.commit("setName", response.data.name)
                localStorage.setItem("name", response.data.name)
            }
            catch(err){
                if(err.status == 500)
                {
                    this.errorServer = true
                    console.log(err)
                    return
                }
            }
            this.$router.push("/")
        },
        saveToggles()
        {
            var togglesValues = []
            var i = 0
            for(var s = 0; s < this.toggles.length; s ++){
                togglesValues[i] = this.toggles[s].enabled1
                if(!this.toggles[s].enabled1){
                    this.toggles[s].enabled2 = false
                }
                togglesValues[i + 1] = this.toggles[s].enabled2
                i+=2
            }
            console.log("saved with results : " + togglesValues)
        },
        resetToggles()
        {
            for(var s = 0; s < this.toggles.length; s ++){
                this.toggles[s].enabled1 = false
                this.toggles[s].enabled2 = false
            }
            console.log("reset")
        }
    }
}
</script>
<style scoped>
    html,
    body {
        height: 100%;
    }
    #app{
        background: none;
    }
    .back{
        background-image: url('../assets/clouds.jpg');
        background-size:cover; 
    }
</style>