import httpService from "./http-service"

export class ProofService {
    constructor(httpService) {
        this.httpService = httpService
    }
    uploadProof(formData) {
        return this.httpService.put("1.0/proofdeposit", formData)
    }
    getFingerprint(formData) {
        return this.httpService.post("1.0/getfingerprint", formData)
    }
    compareFingerprints(fingerprint) {
        return this.httpService.post("1.0/proofexists", fingerprint)
    }
    async uploadProofs(files, formData) {
        const beginRes = await this.httpService.post("1.0/beginmassdeposit", formData)
        formData.append("file", null)
        formData.append("transactionId", beginRes.data.transactionId)
        for (let i = 0; i < files.length; i++) {
            formData.set("file", files[i])
            await this.httpService.put("1.0/massdeposit", formData)
        }
        await this.httpService.post("1.0/endmassdeposit", { transactionId: beginRes.data.transactionId })
    }

}

export default new ProofService(httpService)