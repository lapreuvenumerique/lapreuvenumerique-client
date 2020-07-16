import httpService from "./http-service"

export class ProofService {
    constructor(httpService) {
        this.httpService = httpService
    }
    uploadProof(formData) {
        return this.httpService.put("1.0/proofdeposit", formData)
    }
    getFingerprint(formData){
        return this.httpService.post("1.0/getfingerprint", formData)
    }
    compareFingerprints(fingerprint){
        return this.httpService.post("1.0/proofexists", fingerprint)
    }

}

export default new ProofService(httpService)