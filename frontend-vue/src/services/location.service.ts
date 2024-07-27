import createApiClient from "./api.service";
import handlingError from "./api.service";
import axios from 'axios';

class TrafficService {
    api: any
    constructor(baseUrl = "https://dtplatform.onrender.com/api") {
        this.api = createApiClient(baseUrl);
    }
    async getLocation(address: string,  bingMapsKey: string) {
        return await axios.get(`https://dev.virtualearth.net/REST/v1/Locations?q=${encodeURIComponent(address)}&key=${bingMapsKey}`).then((res) => {
            return res.data;
        }).catch((err) => {
            handlingError(err);
        })
    }
    async getLocationByPoint(lat: number, lng: number,  bingMapsKey: string) {
        return await axios.get(`https://dev.virtualearth.net/REST/v1/Locations/${lat},${lng}?key=${bingMapsKey}`).then((res) => {
            return res.data;
        }).catch((err) => {
            handlingError(err);
        })
    }
}

export default new TrafficService();