import { AxiosInstance, AxiosPromise } from "axios";

const auth = (axios: AxiosInstance): Auth => ({
    login(email, password) {
        return axios.post(`${axios.defaults.baseURL}/login`, {
            email,
            password,
        })
    },

    logout() {
        return axios.get(`${axios.defaults.baseURL}/logout`, {
            headers: {
                Authorization: `Bearer ${null}` 
            }
        });
    },

    register(email, password) {
        return axios.post(`${axios.defaults.baseURL}/register`, {
            data: {
                email,
                password
            }
        })
    },
})

export default auth

export type Auth = {
    login(email: string, password: string): AxiosPromise;
    logout(): AxiosPromise;
    register(email: string, password: string): AxiosPromise;
}