import httpService from '@/service/http-service'
export class ClientService {
    constructor(httpService) {
        this.httpService = httpService
    }
    getCredits() {
        return this.httpService.get("/1.0/credits")
    }
    getInfo(){
        return this.httpService.get("/1.0/client")
    }

}
export default new ClientService(httpService)