import createApiClient from "./api.service";
import handlingError from "./api.service";
import axios from 'axios';

class AuthService {
    api: any
    constructor(baseUrl = "https://dtplatform.onrender.com/api") {
        this.api = createApiClient(baseUrl);
    }
    async login(data: any) {
        try {
            const tokens = (await this.api.post("https://dtplatform.onrender.com/user/login", data));
            return tokens.data;

        } catch (err: any) {
            if (err.response.status == '401') throw new Error("Sai email hoặc mật khẩu, vui lòng nhập lại");
            else if (err.response.status == '400') throw new Error("Các trường nhập vào không hợp lệ hoặc không đủ ký tự, vui lòng nhập lại");
            throw new Error("Lỗi hệ thống")
        }
    }

    async register(data: any) {
        try {
            const resp = (await this.api.post("https://dtplatform.onrender.com/user/register", data));
            return resp.data;
        } catch (err: any) {
            if (err.response.status == '400') throw new Error("Người dùng này đã tồn tại!");
            else handlingError(err);
        }
    }

    async getMe(token: string) {
        return await axios.get("https://dtplatform.onrender.com/auth/me", {
          headers: {
            Authorization: 'Bearer ' + token
          }
        }).then((res) => {
          return res.data;
        }).catch((err) => {
            if (err.response.status == '401') throw new Error("Chưa đăng nhập");
            throw new Error("Lỗi hệ thống")
        })
    }
}

export default new AuthService();