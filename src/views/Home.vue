<template>
  <v-container fluid style="height: 100%;background:white;">
    <v-row style="height: 100%;">
      <v-col cols="2" style="height: 100%;">
          <v-card
            class="justify-right"
            style="height: 100%; width: 100%;"
          >
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
                  <v-img :src="user.userPicture" max-width="40" max-height="40" class="mr-4 rounded-circle" alt="https://alumni.crg.eu/sites/default/files/default_images/default-picture_0_0.png"></v-img>
                  <span>
                    {{displayName}}
                  </span>
                </v-list-item>
                <v-list-item
                  v-for="item in items"
                  :key="item.title"
                  link
                  @click="pageOpened = item.label"
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
          <v-card
          v-if="this.pageOpened=='settings'"
          class="pa-8"
          >
            <h2 class="mb-5">{{this.$t("home.settings") + " :"}}</h2>
            <v-row>
              <v-col>
                <v-row>
                  <v-col>
                    <v-text-field v-model="this.user.displayName" label="Display name">
                    </v-text-field>
                  </v-col>
                  <v-col>
                      <vue-dropzone ref="imageDropzone" id="dropzone" :options="dropzoneOptions" :useCustomSlot="true">
                     <div class="dropzone-custom-content">
                      <h3 class="dropzone-custom-title">{{this.$t("home.dropzoneHeader")}}</h3>
                      <div class="subtitle">{{this.$t("home.dropzoneSubtitle")}}</div>
                    </div>
                    </vue-dropzone>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <span>
                    <v-text-field v-model="this.user.username" label="Username">
                    </v-text-field>
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
                        <v-alert
                            v-if="this.passwordError"
                            type="error"
                            class="mt-3"
                            >
                               {{$t("home.passwordDifferent")}} 
                            </v-alert>
                        <v-text-field
                          v-model="this.user.customerUid"
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
                   <v-row
                    dense
                    >
                      <v-col cols="3">
                        
                      </v-col>
                      <v-col cols="3">
                        <span>{{this.$t("common.togglelist.available")}}</span>
                      </v-col>
                        <v-col cols="3">
                        <span>{{this.$t("common.togglelist.required")}}</span>
                    </v-col>
                  </v-row>
                  </v-col>
                  
                </v-row>
                <v-row
                dense
                >
                  <v-col
                  cols="6"
                  v-for="toggle in settingsToggles"
                  :key="toggle.title"
                  dense
                  >
                  <v-row
                  dense
                  >
                    <v-col cols="3">
                      <span class="layout align-center fill-height">
                        {{toggle.title}}
                      </span>
                    </v-col>
                    <v-col cols="3">
                        <v-switch
                        v-model="toggle.enabled1"
                        inset
                        ></v-switch>
                    </v-col>
                      <v-col cols="3">
                        <v-switch
                        v-if="toggle.enabled1"
                        v-model="toggle.enabled2"
                        inset
                        ></v-switch>
                    </v-col>
                  </v-row>
                    
                  </v-col>
                </v-row>
                
              </v-col>
            </v-row>
            <div class="full-width">
              <v-btn 
              @click="save"
              color="primary"
              >
                      {{$t("register.save")}}
              </v-btn>
            </div>
          </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import dbService from '../service/db-service'
import bcrypt from "bcryptjs"
export default {
  icons: {
    iconfont: 'md',
  },
  
  data(){
    
    return {
      customerUID : "3b462174-7bc9-445f-b746-83decc854d92",
      customerUIDRules:[value => !!value || this.$t("common.uidRequired"), value => value.length == 36 || this.$t("common.uidCount")],
      apiKeyeyevalue: true,
      apiKey : "84816873e95047d2a02853421a1d21deb133680b812378a82e7c32d8fdea4960",
      apiKeyRules:[value => !!value || this.$t("common.apiKeyRequired"),value => value.length == 64  || this.$t("common.apiKeyCount")],
      passwordeyevalue : true,
      password : "",
      passwordRules:[value => !!value || this.$t("common.passwordRequired"), value => value.search(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,30})/g) != -1  || this.$t("common.passwordWrong")],
      confirmPasswordeyevalue : true,
      confirmPassword : "",
      passwordError: false,
      confirmPasswordRules:[value => !!value || this.$t("common.passwordRequired"), value => value.search(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,30})/g) != -1  || this.$t("common.passwordWrong")],
      dropzoneOptions: {
          url: 'https://httpbin.org/post',
          thumbnailWidth: 500,
          addRemoveLinks: true,
          maxFiles: 1
      },
      admin: true,
      displayName:"John Doe",
      username:"JohnDoe",
      pageOpened: "settings",
      user : {
        customerUid: "",
        apiKey : ""
      },
      items: 
      [
          { title: this.$t("home.proofDeposit"), icon: 'mdi-upload', label:"proofDeposit"},
          { title: this.$t("home.proofSearch"), icon: 'mdi-file-search', label:"proofSearch"},
          { title: this.$t("home.docVerify"), icon: 'mdi-file-check',label:"docVerify"},
          { title: this.$t("home.integrity"), icon: 'mdi-check-circle',label:"integrity"},
          { title: this.$t("home.settings"), icon: 'mdi-cog',label:"settings"},
      ],
      settingsToggles:
      [
          {index : "file", title : this.$t("common.togglelist.file"), enabled1 : false, enabled2 : false},
          {index : "fileNumber", title : this.$t("common.togglelist.fileNumber"), enabled1 : false, enabled2 : false},
          {index : "reference", title : this.$t("common.togglelist.reference"), enabled1 : false, enabled2 : false},
          {index : "uids", title : this.$t("common.togglelist.uids"), enabled1 : false, enabled2 : false},
          {index : "copy", title : this.$t("common.togglelist.copy"), enabled1 : false, enabled2 : false},
          {index : "identity", title : this.$t("common.togglelist.identity"), enabled1 : false, enabled2 : false},
          {index : "batchNumber", title : this.$t("common.togglelist.batchNumber"), enabled1 : false, enabled2 : false},
          {index : "topic", title : this.$t("common.togglelist.topic"), enabled1 : false, enabled2 : false},
          {index : "rgpdDuration", title : this.$t("common.togglelist.rgpdDuration"), enabled1 : false, enabled2 : false},
          {index : "visa", title : this.$t("common.togglelist.visa"), enabled1 : false, enabled2 : false},
          {index : "keywords", title : this.$t("common.togglelist.keywords"), enabled1 : false, enabled2 : false},
          {index : "okkayId", title : this.$t("common.togglelist.okkayId"), enabled1 : false, enabled2 : false},
          {index : "filename", title : this.$t("common.togglelist.filename"), enabled1 : false, enabled2 : false}
      ]
    }
  },
  
  async mounted(){
    const res = await dbService.getUserById(this.$store.state.id)
    this.user = res
  },
  methods:{
    async save()
        {
          if(this.password != this.confirmPassword){
            this.passwordError = true
            return
          }
          this.passwordError = false
            let properties = {}
            for(let i = 0; i < this.settingsToggles.length; i ++){
                let val = 0
                if(this.settingsToggles[i].enabled1){
                    if(this.settingsToggles[i].enabled2){
                        val = 2
                    }else{
                        val = 1
                    }
                }
                properties[this.settingsToggles[i].index] = val
            }

            const res = await dbService.updateUserById(this.$store.state.id, this.user.username, await bcrypt.hash(this.confirmPassword, 12), this.user.displayName, this.user.userPicture ,this.user.apiKey, this.user.customerUid, properties)
            
            if(res.status == "SUCCESS")
            {
                console.log(res)
            }
            else
            {
                console.log(res)
                this.errorUsername = true
            }

        },
  },
  components:{
    vueDropzone: vue2Dropzone
  }

}
</script>

<style scoped>

</style>
