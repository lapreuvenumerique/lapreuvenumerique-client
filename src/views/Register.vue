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
                                required
                                :rules="usernameRules"
                                :label="$t('register.usernameLabel')"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row justify="center">
                        <v-col cols="4">
                            <v-text-field
                                v-model="password"
                                :rules="passwordRules"
                                type="password"
                                :label="$t('register.passwordLabel')"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row justify="center">
                        <v-col cols="4">
                            <v-text-field
                                v-model="customerUID"
                                counter="36"
                                required
                                :rules="customerUIDRules"
                                :label="$t('register.uidLabel')"
                                maxlength="36"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row justify="center">
                        <v-col cols="4">
                            <v-text-field
                                v-model="apiKey"
                                counter="64"
                                :rules="apiKeyRules"
                                type="password"
                                :label="$t('register.apiKeyLabel')"
                                maxlength="64"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row justify="center">
                        <v-col cols="4" class="text-center">
                            <v-btn 
                            @click="register"
                            :disabled="!isValid"
                            >
                                {{$t("register.submit")}}
                            </v-btn>
                            
                            <v-alert
                            v-if="errorCredentials"
                            type="error"
                            class="mt-3"
                            >
                               {{$t("register.errorcrendentials")}} 
                            </v-alert>
                            
                            <v-alert
                            v-if="errorServer"
                            type="error"
                            class="mt-3"
                            >
                               {{$t("register.errorserver")}} 
                            </v-alert>
                        </v-col>
                    </v-row>
                </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import servicesFactory from "../service/service-factory"
import dbService from "../service/db-service"
export default {
    data(){
        return{
            errorCredentials: false,
            errorServer: false,
            username : "Admin",
            usernameRules:[value => !!value || this.$t("register.usernameRequired"),value => value.length > 4  || this.$t("register.usernameCount")],
            password : "Admin123",
            passwordRules:[value => !!value || this.$t("register.passwordRequired"), value => value.search(/((?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,30})/g) != -1 || this.$t  || this.$t("register.passwordWrong")],
            apiKey : "84816873e95047d2a02853421a1d21deb133680b812378a82e7c32d8fdea4960",
            apiKeyRules:[value => !!value || this.$t("register.apiKeyRequired"),value => value.length == 64  || this.$t("register.apiKeyCount")],
            customerUID : "3b462174-7bc9-445f-b746-83decc854d92",
            customerUIDRules:[value => !!value || this.$t("register.uidRequired"), value => value.length == 36 || this.$t("register.uidCount")],
            isValid : false
        }
    },
    methods:{
        async register(){
            localStorage.setItem("apiKey", this.apiKey)
            localStorage.setItem("customerUID", this.customerUID)
            dbService.register()
            try{
                
                const response = await servicesFactory.getClientService().register()
                console.log(response)
                this.$store.commit("setName", response.data.name)
                localStorage.setItem("name", response.data.name)
            }
            catch(err){
                if(err.status == 401)
                {
                    this.errorCredentials = true
                    console.log(err)
                    return
                }
                if(err.status == 500)
                {
                    this.errorServer = true
                    console.log(err)
                    return
                }
            }
            this.$router.push("/")
        }
    }
}
</script>