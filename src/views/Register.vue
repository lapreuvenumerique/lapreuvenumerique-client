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
                   v-model="displayName"
                   required
                   :rules="usernameRules"
                   :label="$t('common.displayNameLabel')"
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
                            v-if="errorUsername"
                            type="error"
                            class="mt-3"
                            >
                               {{$t("register.errorUsername")}} 
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
                        <v-row>
                            <v-col cols="4">
                                
                            </v-col>
                            <v-col cols="4" class="text-center">
                                <span>{{this.$t("common.togglelist.available")}}</span>
                            </v-col>
                            <v-col cols="4" class="text-center">
                                <span>{{this.$t("common.togglelist.required")}}</span>
                            </v-col>
                        </v-row>
                        <v-row
                        v-for="toggle in toggles"
                        :key="toggle.index"
                        link
                        dense
                        >
                            <v-col cols="4" dense>
                                <span class="layout align-center justify-center fill-height">{{toggle.title}}</span>
                            </v-col>
                            <v-col cols="4" class="justify-center">
                                <v-switch
                                    v-model= toggle.enabled1
                                    inset
                                    dense
                                    
                                ></v-switch>
                            </v-col>
                            <v-col cols="4" class="justify-center">
                                <v-switch
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
                    </v-card-actions>
                </v-card>
            </v-col>
            
        </v-row>
    </v-container>
</template>

<script>
import dbService from "../service/db-service"
export default {
    data(){
        return{
            errorUsername:false,
            errorServer: false,
            passwordeyevalue : true,
            secretKeyeyevalue:true,
            apiKeyeyevalue:true,
            displayName : "John",
            username : "Admin",
            usernameRules:[value => !!value || this.$t("register.usernameRequired"),value => value.length >= 4  || this.$t("common.usernameCount")],
            password : "Admin123",
            passwordRules:[value => !!value || this.$t("common.passwordRequired"), value => value.search(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,30})/g) != -1  || this.$t("common.passwordWrong")],
            apiKey : "84816873e95047d2a02853421a1d21deb133680b812378a82e7c32d8fdea4960",
            apiKeyRules:[value => !!value || this.$t("common.apiKeyRequired"),value => value.length == 64  || this.$t("common.apiKeyCount")],
            customerUID : "3b462174-7bc9-445f-b746-83decc854d92",
            customerUIDRules:[value => !!value || this.$t("common.uidRequired"), value => value.length == 36 || this.$t("common.uidCount")],
            isValid : false,

           toggles: [
          {index : "file", title : this.$t("common.togglelist.file"), available : this.$t("common.togglelist.available"),  required : this.$t("common.togglelist.required"), enabled1 : false, enabled2 : false},
          {index : "fileNumber", title : this.$t("common.togglelist.fileNumber"), available : this.$t("common.togglelist.available"),  required : this.$t("common.togglelist.required"), enabled1 : false, enabled2 : false},
          {index : "reference", title : this.$t("common.togglelist.reference"), available : this.$t("common.togglelist.available"),  required : this.$t("common.togglelist.required"), enabled1 : false, enabled2 : false},
          {index : "uids", title : this.$t("common.togglelist.uids"), available : this.$t("common.togglelist.available"),  required : this.$t("common.togglelist.required"), enabled1 : false, enabled2 : false},
          {index : "copy", title : this.$t("common.togglelist.copy"), available : this.$t("common.togglelist.available"),  required : this.$t("common.togglelist.required"), enabled1 : false, enabled2 : false},
          {index : "identity", title : this.$t("common.togglelist.identity"), available : this.$t("common.togglelist.available"),  required : this.$t("common.togglelist.required"), enabled1 : false, enabled2 : false},
          {index : "batchNumber", title : this.$t("common.togglelist.batchNumber"), available : this.$t("common.togglelist.available"),  required : this.$t("common.togglelist.required"), enabled1 : false, enabled2 : false},
          {index : "topic", title : this.$t("common.togglelist.topic"), available : this.$t("common.togglelist.available"),  required : this.$t("common.togglelist.required"), enabled1 : false, enabled2 : false},
          {index : "rgpdDuration", title : this.$t("common.togglelist.rgpdDuration"), available : this.$t("common.togglelist.available"),  required : this.$t("common.togglelist.required"), enabled1 : false, enabled2 : false},
          {index : "visa", title : this.$t("common.togglelist.visa"), available : this.$t("common.togglelist.available"),  required : this.$t("common.togglelist.required"), enabled1 : false, enabled2 : false},
          {index : "keywords", title : this.$t("common.togglelist.keywords"), available : this.$t("common.togglelist.available"),  required : this.$t("common.togglelist.required"), enabled1 : false, enabled2 : false},
          {index : "okkayId", title : this.$t("common.togglelist.okkayId"), available : this.$t("common.togglelist.available"),  required : this.$t("common.togglelist.required"), enabled1 : false, enabled2 : false},
          {index : "filename", title : this.$t("common.togglelist.filename"), available : this.$t("common.togglelist.available"),  required : this.$t("common.togglelist.required"), enabled1 : false, enabled2 : false}
        ],
        }
    },
    methods:{
        async register()
        {
            let properties = {}
            for(let i = 0; i < this.toggles.length; i ++){
                let val = 0
                if(this.toggles[i].enabled1){
                    if(this.toggles[i].enabled2){
                        val = 2
                    }else{
                        val = 1
                    }
                }
                properties[this.toggles[i].index] = val
            }
            const res = await dbService.register(this.username, this.password, this.displayName ,this.apiKey, this.customerUID, properties)
           
            if(res.status == "SUCCESS")
            {
                this.$router.push("/login")
            }else
            {
                this.errorUsername = true
            }

        },
        resetToggles()
        {
            for(let s = 0; s < this.toggles.length; s ++){
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