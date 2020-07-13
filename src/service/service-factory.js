import httpService from "./http-service";
import { ClientService } from "./client-service";

export class ServicesFactory {

    constructor() {
        this.httpService = httpService
    }

    getClientService() {
        console.log(this.clientService);
        if(!this.clientService) {
            this.clientService = new ClientService(this.httpService)
        }

        return this.clientService
    }
}

export default new ServicesFactory()
