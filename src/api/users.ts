import { AxiosInstance, AxiosPromise } from 'axios'

const users = (axios: AxiosInstance): Users => ({
    getCurrentUser() {
        return axios.get(`${axios.defaults.baseURL}/users/current`);
    },
    
    getGroupUsers() {
        return axios.get(`${axios.defaults.baseURL}/users/all`);
    },

    getUserById(id) {
        return axios.get(`${axios.defaults.baseURL}/users/${id}`);
    },
})

export default users

export type Users = {
    getCurrentUser(): AxiosPromise;
    getGroupUsers(): AxiosPromise;
    getUserById(id: string): AxiosPromise;
}