import createApiClient from "./api.service";
import handlingError from "./api.service";
import axios from 'axios';

class TrafficService {
    api: any
    constructor(baseUrl = "https://dtplatform.onrender.com/api") {
        this.api = createApiClient(baseUrl);
    }
    async getTraffic(token: string) {
        return await axios.get(`https://dev.virtualearth.net/REST/v1/Traffic/Incidents/20.4991,104.7231,21.4505,106.5866?key=${token}`).then((res) => {
            return res.data;
        }).catch((err) => {
            handlingError(err);
        })
    }
}

export default new TrafficService();