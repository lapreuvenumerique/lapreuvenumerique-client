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
                  <v-img src="https://alumni.crg.eu/sites/default/files/default_images/default-picture_0_0.png" max-width="40" max-height="40" class="mr-4 rounded-circle"></v-img>
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
                    <v-text-field :value="this.displayName" label="Display name">
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
                    <v-text-field :value="this.username" label="Username">
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
                        <v-text-field
                          v-model="customerUID"
                          :rules="customerUIDRules"
                          :label="this.$t('common.uidLabel')"
                        ></v-text-field>
                        <v-text-field
                          v-model="apiKey"
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
                        :label="toggle.label1"
                        v-model="toggle.enabled1"
                        inset
                        ></v-switch>
                    </v-col>
                      <v-col cols="3">
                        <v-switch
                        :label="toggle.label2"
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
      ]
    }
  },
  mounted(){
    //this.displayName =this.$store.state.name
  },
  methods:{

  },
  components:{
    vueDropzone: vue2Dropzone
  }

}
</script>

<style scoped>

</style>
