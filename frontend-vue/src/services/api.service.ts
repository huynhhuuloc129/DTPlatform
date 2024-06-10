import axios from "axios";

export default (baseURL: any) => {
    return axios.create({
        baseURL,
        ...commonConfig,
    });

};

const commonConfig = {
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
};

export function handlingError(error: any) {
    throw error
}