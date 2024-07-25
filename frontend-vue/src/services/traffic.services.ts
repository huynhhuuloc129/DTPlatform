import createApiClient from "./api.service";
import handlingError from "./api.service";
import axios from 'axios';

class TrafficService {
    api: any
    constructor(baseUrl = "https://dtplatform.onrender.com/api") {
        this.api = createApiClient(baseUrl);
    }
    async getTraffic(token: string) {
        return await axios.get(`https://dev.virtualearth.net/REST/v1/Traffic/Incidents/8.179,102.144,23.393,109.465?key=${token}`).then((res) => {
            return res.data;
        }).catch((err) => {
            handlingError(err);
        })
    }
}

export default new TrafficService();