import createApiClient from "./api.service";
import handlingError from "./api.service";
import axios from 'axios';

class AzureService {
    api: any
    constructor(baseUrl = "https://samples.azuremaps.com/api/") {
        this.api = createApiClient(baseUrl);
    }
    async getToken(resolve: any, reject: any, map: any) {
        // @ts-ignore
        await axios.get(`https://samples.azuremaps.com/api/GetAzureMapsToken`).then(r => r.text()).then(token => resolve(token))
        .catch((err) => {
            handlingError(err);
        })
    }
  
}

export default new AzureService();