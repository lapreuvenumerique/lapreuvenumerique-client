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
              <v-col
              v-if="this.admin"
              >
                <v-text-field :value="this.displayName" label="Username">
                </v-text-field>

                <vue-dropzone ref="imageDropzone" id="dropzone" :options="dropzoneOptions" :useCustomSlot="true">
                     <div class="dropzone-custom-content">
                      <h3 class="dropzone-custom-title">{{this.$t("home.dropzoneHeader")}}</h3>
                      <div class="subtitle">{{this.$t("home.dropzoneSubtitle")}}</div>
                    </div>
                </vue-dropzone>
                <v-row>
                  <v-col
                    v-for="toggle in settingsToggles"
                    :key="toggle.label1">
                    <span>
                      {{toggle.title}}
                    </span>
                  </v-col>
                  <v-col>
                      <v-switch
                      :label="toggle.label1"
                      v-model="toggle.enabled1"
                      ></v-switch>
                  </v-col>
                    <v-col>
                      <v-switch
                      :label="toggle.label2"
                      v-if="toggle.enabled1"
                      v-model="toggle.enabled2"
                      ></v-switch>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
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
      dropzoneOptions: {
          url: 'https://httpbin.org/post',
          thumbnailWidth: 500,
          addRemoveLinks: true,
          maxFiles: 1
      },
      admin: true,
      displayName:"John",
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
          {index : 1, title : this.$t("common.togglelist.line1.title"), label1 : this.$t("common.togglelist.line1.label1"),  label2 : this.$t("common.togglelist.line1.label2"), enabled1 : false, enabled2 : false},
          {index : 2, title : this.$t("common.togglelist.line2.title"), label1 : this.$t("common.togglelist.line2.label1"),  label2 : this.$t("common.togglelist.line2.label2"), enabled1 : false, enabled2 : false},
          {index : 3, title : this.$t("common.togglelist.line3.title"), label1 : this.$t("common.togglelist.line3.label1"),  label2 : this.$t("common.togglelist.line3.label2"), enabled1 : false, enabled2 : false},
          {index : 4, title : this.$t("common.togglelist.line4.title"), label1 : this.$t("common.togglelist.line4.label1"),  label2 : this.$t("common.togglelist.line4.label2"), enabled1 : false, enabled2 : false},
          {index : 5, title : this.$t("common.togglelist.line5.title"), label1 : this.$t("common.togglelist.line5.label1"),  label2 : this.$t("common.togglelist.line5.label2"), enabled1 : false, enabled2 : false},
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
