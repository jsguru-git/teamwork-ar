import { AxiosInstance, AxiosPromise } from 'axios'

const utils = (axios: AxiosInstance): Utils => ({
    async transcribe(filePath) {
        const formData = new FormData();
        formData.append('file', { name: 'audio', uri: `file://${filePath}`, type: 'audio/amr'});
        return axios.post(`${axios.defaults.baseURL}/utils/transcribe`, 
            formData
        )
    },

    translate(text, target) {
        return axios.post(`${axios.defaults.baseURL}/utils/translate`, {
            text,
            target
        });
    },

    synthesize(text, languageCode) {
        return axios.post(`${axios.defaults.baseURL}/utils/synthesize`, {
            text,
            languageCode
        });
    }
})

export default utils;

export type Utils = {
    transcribe(filePath: string): AxiosPromise,
    translate(text: string, target: string): AxiosPromise,
    synthesize(text: string, languageCode: string): AxiosPromise
}