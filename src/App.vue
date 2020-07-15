
<template>
    <v-app>
        <v-main>
            <router-view />
        </v-main>
    </v-app>
</template>

<script>
export default {
    name: "App",

    components: {},
    mounted() {
        if(this.$route.path != "/login"){
            this.$router.replace("/login");
        }
    },

    data: () => ({
        //
    })
};
</script>
