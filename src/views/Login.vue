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
                                v-model="customerUID"
                                counter="36"
                                required
                                :rules="customerUIDRules"
                                :label="$t('login.uidLabel')"
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
                                :label="$t('login.apiKeyLabel')"
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
                               {{$t("login.errorcrendentials")}} 
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
export default {
    data(){
        return{
            errorCredentials: false,
            apiKey : "84816873e95047d2a02853421a1d21deb133680b812378a82e7c32d8fdea4960",
            apiKeyRules:[value => !!value || this.$t("login.apiKeyRequired"),value => value.length == 64  || this.$t("login.apiKeyCount")],
            customerUID : "3b462174-7bc9-445f-b746-83decc854d92",
            customerUIDRules:[value => !!value || this.$t("login.uidRequired"), value => value.length == 36 || this.$t("login.uidCount")],
            isValid : false
        }
    },
    methods:{
        async login(){
            localStorage.setItem("apiKey", this.apiKey)
            localStorage.setItem("customerUID", this.customerUID)
            try{
                const response = await servicesFactory.getClientService().login()
                console.log(response)
                this.$store.commit("setName", response.data.name)
                localStorage.setItem("name", response.data.name)
            }
            catch(err){
                this.errorCredentials = true
                console.log(err)
                return
            }
            this.$router.push("/")
        }
    }
}
</script>