import createApiClient from "./api.service";
import handlingError from "./api.service";
import axios from 'axios';

class AuthService {
    api: any
    constructor(baseUrl = "https://dtplatform.onrender.com/road") {
        this.api = createApiClient(baseUrl);
    }
    async getRoad(token: string) {
        return await axios.get(`https://dtplatform.onrender.com/road/get-road`, {
            headers: {
                'token': token
            }
        }).then((res) => {
            return res.data;
        }).catch((err) => {
            handlingError(err);
        })
    }
    async getRoadNear(token: string, long: number, lat: number) {
        return await axios.get(`https://dtplatform.onrender.com/road/get-road-near?search=${long},${lat},1,100`, {
            headers: {
                'token': token
            }
        }).then((res) => {
            return res.data;
        }).catch((err) => {
            handlingError(err);
        })
    }
    async getRoadInsideBoundary(token: string, long1: number, lat1: number, long2: number, lat2:number) {

        return await axios.get(`https://dtplatform.onrender.com/road/get-road-inside?search=${long1},${lat1},${long2},${lat2}`, {
            headers: {
                'token': token
            }
        }).then((res) => {
            return res.data;
        }).catch((err) => {
            handlingError(err);
        })
    }
}

export default new AuthService();