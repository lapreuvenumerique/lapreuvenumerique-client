<template>
    <v-container>
        <v-row>
            <v-col>
                <v-form
                :value="isValid"
                >
                    <v-row justify="center">
                        <v-col cols="4">
                            <v-text-field
                                v-model="customerUID"
                                counter="36"
                                required
                                :rules="customerUIDRules"
                                label="Customer UID"
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
                                label="API Key"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row justify="center">
                        <v-col cols="1">
                            <v-btn 
                            @click="login" class="pr-8"
                            v-if="isValid">
                                Submit
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    data(){
        return{
            apiKey : "",
            apiKeyRules:[value => !!value || 'API Key Required',value => value.length == 64  || '64 characters required'],
            customerUID : "",
            customerUIDRules:[value => !!value || 'Customer UID Required', value => value.length == 36 || '36 characters required'],
            isValid : false
        }
    },
    methods:{
        login(){
            console.log(this.apiKey, this.customerUID)
        }
    }
}
</script>