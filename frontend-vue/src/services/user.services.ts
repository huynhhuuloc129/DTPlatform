import createApiClient from "./api.service";
import handlingError from "./api.service";
import axios from 'axios';

class UserService {
    api: any
    constructor(baseUrl = "http://localhost:2000/api") {
        this.api = createApiClient(baseUrl);
    }
    async getUsers(token: string) {
        return await axios.get(`http://localhost:2000/user`, {
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

export default new UserService();