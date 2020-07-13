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
        this.$router.replace("/login");
    },

    data: () => ({
        //
    })
};
</script>
<style>
html,
body {
    height: 100%;
}
</style>
