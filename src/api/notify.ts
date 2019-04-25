import { RegisterBinding } from './types/notify'
import { AxiosInstance, AxiosPromise } from 'axios';

const notify = (axios: AxiosInstance): Notify => ({
    register(binding) {
        return axios.post(`${axios.defaults.baseURL}/notify/register`, binding);
    },

    unregister() {
        return axios.get(`${axios.defaults.baseURL}/notify/unregister`);
    }
})

export default notify

export type Notify = {
    register(binding: RegisterBinding): AxiosPromise;
    unregister(): AxiosPromise;
}