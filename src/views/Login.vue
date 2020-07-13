<template>
    <v-container>
        <v-row>
            <v-col>
                <v-form
                v-model="isValid"
                >
                    <v-row justify="center">
                        <v-col cols="4">
                            <v-text-field
                                v-model="username"
                                counter="36"
                                required
                                :rules="usernameRules"
                                :label="$t('login.usernameLabel')"
                                maxlength="36"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row justify="center">
                        <v-col cols="4">
                            <v-text-field
                                v-model="password"
                                counter="64"
                                :rules="passwordRules"
                                type="password"
                                :label="$t('login.passwordLabel')"
                                maxlength="64"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row justify="center">
                        <v-col cols="4" class="text-center">
                            <v-btn 
                            @click="login"
                            :disabled="!isValid"
                            >
                                {{$t("login.submit")}}
                            </v-btn>
                            
                            <v-alert
                            v-if="errorCredentials"
                            type="error"
                            class="mt-3"
                            >
                               {{$t("login.errorCredentials")}} 
                            </v-alert>
                            
                            <v-alert
                            v-if="errorServer"
                            type="error"
                            class="mt-3"
                            >
                               {{$t("login.errorServer")}} 
                            </v-alert>
                        </v-col>
                    </v-row>
                </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import dbService from "../service/db-service"
export default {
    data(){
        return{
            errorCredentials: false,
            errorServer: false,
            password : "84816873e95047d2a02853421a1d21deb133680b812378a82e7c32d8fdea4960",
            passwordRules:[value => !!value || this.$t("login.passwordRequired"),value => value.length == 64  || this.$t("login.passwordCount")],
            username : "3b462174-7bc9-445f-b746-83decc854d92",
            usernameRules:[value => !!value || this.$t("login.usernameRequired"), value => value.length == 36 || this.$t("login.usernameCount")],
            isValid : false
        }
    },
    methods:{
        login(){
            const response = dbService.login(this.username, this.password)
            console.log(response)
            this.$router.push("/")
        }
    }
}
</script>