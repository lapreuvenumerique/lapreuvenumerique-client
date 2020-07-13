<template>
  <v-container fluid style="height: 100%;">
    <v-row style="height: 100%;">
      <v-col cols="12" style="height: 100%;">
          <v-navigation-drawer
        permanent
         style="height: 100%;"
      >
        <v-list-item class="px-2">
          <v-list-item-avatar>
            <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img>
          </v-list-item-avatar>

          <v-list-item-title>{{displayName}}</v-list-item-title>


        </v-list-item>

        <v-divider></v-divider>

        <v-list dense>
          <v-list-item
            v-for="item in items"
            :key="item.title"
            link
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data(){
    return {
      displayName:"",
     items: [
          { title: this.$t("home.proofDeposit"), icon: 'mdi-upload' },
          { title: this.$t("home.proofSearch"), icon: 'mdi-file-search' },
          { title: this.$t("home.docVerify"), icon: 'mdi-file-check' },
          { title: this.$t("home.integrity"), icon: 'mdi-check-circle' },
          { title: this.$t("home.settings"), icon: 'mdi-cog' },
        ],
        mini: true
    }
  },
  mounted(){
    this.displayName =this.$store.state.name
  },
  methods:{

  }

}
</script>
