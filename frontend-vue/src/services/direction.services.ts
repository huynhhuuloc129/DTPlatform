import createApiClient from "./api.service";
import handlingError from "./api.service";
import axios from 'axios';

class DirectionService {
    api: any
    constructor(baseUrl = "https://dtplatform.onrender.com/api") {
        this.api = createApiClient(baseUrl);
    }
    async getDirection(type: string, token: string, longitudeStart: number, latitudeStart: number, longitudeEnd: number, latitudeEnd: number) {
        if (type == 'bus') {
            return await axios.get(`https://api.mapbox.com/directions/v5/mapbox/${longitudeStart},${latitudeStart};${longitudeEnd},${latitudeEnd}?geometries=geojson&steps=true&access_token=${token}`).then((res) => {
                return res.data;
            }).catch((err) => {
                handlingError(err);
            })
        } else 
        return await axios.get(`https://api.mapbox.com/directions/v5/mapbox/${type}/${longitudeStart},${latitudeStart};${longitudeEnd},${latitudeEnd}?geometries=geojson&steps=true&access_token=${token}`).then((res) => {
            return res.data;
        }).catch((err) => {
            handlingError(err);
        })
    }
}

export default new DirectionService();