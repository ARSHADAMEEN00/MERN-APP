import axios from "axios"

// const API_URL_PROD = ""
const API_URL_DEV = "http://127.0.0.1:8000"
const API_URL_PRO = "https://dailynotes-giu6.onrender.com"


export const API_URL = API_URL_DEV

export const axiosApi = axios.create({
    baseURL: API_URL,
    // withCredentials: true,
})

axiosApi.interceptors.request.use(
    function (config) {
        return config
    },
    function (error) { }
)

axiosApi.interceptors.response.use(
    response => {
        return response
    },
    err => {
        return err?.response
    }
)

export async function get(url: string, config = {}) {
    return await axiosApi.get<any>(url, { ...config }).then(response => response?.data)
}

export async function post(url: string, data: any, config = {}) {
    return axiosApi
        .post(url, { ...data }, { ...config })
        .then(response => ({ ...response?.data, header: response }))
}

export async function put(url: string, data: any, config = {}) {
    return axiosApi
        .put(url, { ...data }, { ...config })
        .then(response => response?.data)
}

export async function patch(url: string, data: any, config = {}) {
    return axiosApi
        .patch(url, { ...data }, { ...config })
        .then(response => response?.data)
}

export async function del(url: string, config = {}) {
    return await axiosApi
        .delete(url, { ...config })
        .then(response => response?.data)
}
