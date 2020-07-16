import httpService from "./http-service"

export class ProofService {
    constructor(httpService) {
        this.httpService = httpService
    }
    uploadProof(formData) {
        return this.httpService.put("1.0/proofdeposit", formData)
    }

}

export default new ProofService(httpService)