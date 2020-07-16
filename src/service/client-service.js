import httpService from '@/service/http-service'
export class ClientService {
    constructor(httpService) {
        this.httpService = httpService
    }
    getCredits() {
        return this.httpService.get("/1.0/credits")
    }

}
export default new ClientService(httpService)