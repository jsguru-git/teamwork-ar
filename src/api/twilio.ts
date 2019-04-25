import { AxiosInstance, AxiosPromise } from 'axios'

const twilio = (axios: AxiosInstance): Twilio => ({
    token() {
        return axios.get(`${axios.defaults.baseURL}/token`)
    },

    joinToken(room: string) {
        return axios.post(`${axios.defaults.baseURL}/token`, {
                room
            }
        )
    }
})

export default twilio;

export type Twilio = {
    token(): AxiosPromise;
    joinToken(room: string): AxiosPromise;
}