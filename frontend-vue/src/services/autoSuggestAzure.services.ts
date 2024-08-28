import createApiClient from "./api.service";
import handlingError from "./api.service";
import axios from 'axios';

class AutoSuggestAzureService {
    api: any
    constructor(baseUrl = "https://dtplatform.onrender.com/api") {
        this.api = createApiClient(baseUrl);
    }
    async getSuggestion(q:string, token: string) {
        return await axios.get(`https://atlas.microsoft.com/search/address/json?subscription-key=${token}&api-version=1.0&language=vi-VN&query=${q}&limit=5`).then((res) => {
            return res.data;
        }).catch((err) => {
            handlingError(err);
        })
    }
}

export default new AutoSuggestAzureService();
