
export class ClientService {
    constructor(httpService) {
        this.httpService = httpService
    }
    login() {
        return this.httpService.get("/1.0/companyname")
    }
    register() {
        return "request sent"
    }

}