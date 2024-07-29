import createApiClient from "./api.service";
import handlingError from "./api.service";
import axios from 'axios';

class AutoSuggestService {
    api: any
    constructor(baseUrl = "https://dtplatform.onrender.com/api") {
        this.api = createApiClient(baseUrl);
    }
    async getAutoSuggest(q:string, token: string) {
        return await axios.get(`http://dev.virtualearth.net/REST/v1/Autosuggest?query=${q}&maxResults=5&key=${token}`).then((res) => {
            return res.data;
        }).catch((err) => {
            handlingError(err);
        })
    }
}

export default new AutoSuggestService();