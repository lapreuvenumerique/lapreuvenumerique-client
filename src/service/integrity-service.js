import httpService from "./http-service"

export class IntegrityService {
    constructor(httpService) {
        this.httpService = httpService
    }
    verifyIntegrity() {
        return this.httpService.get("/1.0/verifyintegrity")
    }

}

export default new IntegrityService(httpService)