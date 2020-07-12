import httpService from "./http-service"

export class ClientService {
    constructor(httpService) {
        this.httpService = httpService
    }

}

export default new ClientService(httpService)