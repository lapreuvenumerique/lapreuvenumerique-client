import httpService from "@/service/http-service";
export class ClientService {
  constructor(httpService) {
    this.httpService = httpService;
  }
  getCredits() {
    return this.httpService.get("/1.0/credits");
  }
  getInfo() {
    return this.httpService.get("/1.0/client");
  }
  getQuery(data) {
    return this.httpService.post("/1.0/proofsquery", data);
  }
  getProofCount() {
    return this.httpService.get("/1.0/proofscount");
  }
  downloadProof(id) {
    return this.httpService.get("/1.0/prooffiledownload/" + id, true);
  }
  downloadReceipt(id) {
    return this.httpService.get("/1.0/proofreceiptdownload/" + id, true);
  }
  getTopics() {
    return this.httpService.get("/1.0/topics");
  }
  getValid() {
    return this.httpService.get("/1.0/login");
  }
}
export default new ClientService(httpService);
