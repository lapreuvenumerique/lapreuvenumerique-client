<template>
    <v-container>
        <v-row>
              <v-col>
                <v-row>
                  <v-col>
                    <v-text-field v-model="this.user.displayName" label="Display name">
                    </v-text-field>
                  </v-col>
                  <v-col>
                      <vue-dropzone ref="imageDropzone" id="dropzone" :options="dropzoneOptions" :useCustomSlot="true">
                     <div class="dropzone-custom-content">
                      <h3 class="dropzone-custom-title">{{this.$t("home.dropzoneHeader")}}</h3>
                      <div class="subtitle">{{this.$t("home.dropzoneSubtitle")}}</div>
                    </div>
                    </vue-dropzone>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <span>
                    <v-text-field v-model="this.user.username" label="Username">
                    </v-text-field>
                        <v-text-field
                          v-model="password"
                          :append-icon="passwordeyevalue ? 'mdi-eye' : 'mdi-eye-off'"
                          :rules="passwordRules"
                          :type="passwordeyevalue ? 'password' : 'text'"
                          @click:append="() => (passwordeyevalue = !passwordeyevalue)"
                          :label="this.$t('home.newPassword')"
                        ></v-text-field>
                        <v-text-field
                          v-model="confirmPassword"
                          :append-icon="confirmPasswordeyevalue ? 'mdi-eye' : 'mdi-eye-off'"
                          :rules="confirmPasswordRules"
                          :type="confirmPasswordeyevalue ? 'password' : 'text'"
                          @click:append="() => (confirmPasswordeyevalue = !confirmPasswordeyevalue)"
                          :label="this.$t('home.confirmNewPassword')"
                        ></v-text-field>
                        <v-alert
                            v-if="this.passwordError"
                            type="error"
                            class="mt-3"
                            >
                               {{$t("home.passwordDifferent")}} 
                            </v-alert>
                        <v-text-field
                          v-model="this.user.customerUid"
                          :rules="customerUIDRules"
                          :label="this.$t('common.uidLabel')"
                        ></v-text-field>
                        <v-text-field
                          v-model="user.apiKey"
                          :append-icon="apiKeyeyevalue ? 'mdi-eye' : 'mdi-eye-off'"
                          :rules="apiKeyRules"
                          :type="apiKeyeyevalue ? 'password' : 'text'"
                          @click:append="() => (apiKeyeyevalue = !apiKeyeyevalue)"
                          :label="this.$t('common.apiKeyLabel')"
                        ></v-text-field>
                    </span>
                  </v-col>
                </v-row>

                
                <h4 class="mt-8">{{this.$t("common.togglelist.title")}}</h4>
                <v-row>
                  <v-col cols="6"> 
                   <v-row
                    dense
                    >
                      <v-col cols="3">
                        
                      </v-col>
                      <v-col cols="3">
                        <span>{{this.$t("common.togglelist.available")}}</span>
                      </v-col>
                        <v-col cols="3">
                        <span>{{this.$t("common.togglelist.required")}}</span>
                    </v-col>
                  </v-row>
                  </v-col>
                  
                </v-row>
                <v-row
                dense
                >
                  <v-col
                  cols="6"
                  v-for="toggle in settingsToggles"
                  :key="toggle.title"
                  dense
                  >
                  <v-row
                  dense
                  >
                    <v-col cols="3">
                      <span class="layout align-center fill-height">
                        {{toggle.title}}
                      </span>
                    </v-col>
                    <v-col cols="3">
                        <v-switch
                        v-model="toggle.enabled1"
                        inset
                        ></v-switch>
                    </v-col>
                      <v-col cols="3">
                        <v-switch
                        v-if="toggle.enabled1"
                        v-model="toggle.enabled2"
                        inset
                        ></v-switch>
                    </v-col>
                  </v-row>
                    
                  </v-col>
                </v-row>
                
              </v-col>
            </v-row>
    </v-container>
</template>
<script>
export default {
    data(){
        return {
            
        }
    }
}
</script>