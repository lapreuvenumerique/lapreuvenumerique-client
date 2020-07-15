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
                <h4 class="mb-5">{{this.$t("home.adminTitle")}}</h4>
                <form action="/upload-target" class="dropzone"></form>
                <v-switch
                v-for="toggle in settingsAdmin"
                :key="toggle.label"
                :label="toggle.label"
                v-model="toggle.enabled"
                ></v-switch>
              </v-col>
            </v-row>
          </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data(){
    return {
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
      settingsAdmin:
      [
        {label: this.$t("home.adminSettings.setting1"), enabled: false},
        {label: this.$t("home.adminSettings.setting2"), enabled: false},
        {label: this.$t("home.adminSettings.setting3"), enabled: false},
        {label: this.$t("home.adminSettings.setting4"), enabled: false},
        {label: this.$t("home.adminSettings.setting5"), enabled: false},
      ]
    }
  },
  mounted(){
    //this.displayName =this.$store.state.name
  },
  methods:{

  }

}
</script>

<style scoped>

</style>
