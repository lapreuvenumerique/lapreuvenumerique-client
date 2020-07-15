
<template>
    <v-app>
        <v-main>
            <router-view />
        </v-main>
    </v-app>
</template>

<script>
//import dbService from "./service/db-service"
export default {
    name: "App",

    components: {},
    mounted() {
        //dbService.createTables()
        //this.$router.replace("/register");
    },

    data: () => ({
        //
    })
};
</script>
