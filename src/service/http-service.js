import axios from 'axios';
import * as cfg from "../config"
import store from "../store/index"

axios.defaults.baseURL = cfg.getServerUrl();

/**
 * Handles all HTTP calls
 */
export class HttpService {

    constructor() {
    }

    post(url, data) {
        return axios.post(url, data, {
            headers: this.getHeaders(),
            responseType: 'json'
        })
    }

    put(url, data) {
        return axios.put(url, data, {
            headers: this.getHeaders(),
            responseType: 'json'
        })
    }

    get(url, isBlob = false) {
        return axios.get(url, {
            headers: this.getHeaders(),
            responseType: (isBlob ? 'blob' : 'json')
        })
    }
    patch(url, data) {
        return axios.patch(url, data, {
            headers: this.getHeaders(),
        })
    }

    delete(url) {
        return axios.delete(url, {
            headers: this.getHeaders()
        })
    }

    getHeaders() {
        const headers = {
            'Authorization': 'Basic ' + store.state.apiKey,
            'x-customeruid': store.state.customerUid
        }
        return headers
    }

}

export default new HttpService()
