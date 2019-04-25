//@ts-ignore
import { DEV_API_URL } from 'react-native-dotenv'
import axios, { AxiosInstance } from "axios"

import auth, { Auth } from "./auth"
import sessions, { Sessions } from './sessions'
import notify, { Notify } from "./notify"
import twilio, { Twilio } from './twilio'
import users, { Users } from "./users"
import utils, { Utils } from "./utils";

export default class Api {
    static instance: Api
    private axios: AxiosInstance = axios;
    private token: string = '';
    public auth!: Auth;
    public sessions!: Sessions;
    public notify!: Notify;
    public twilio!: Twilio;
    public users!: Users;
    public utils!: Utils
    constructor() {
        if (Api.instance) {
            return Api.instance;
        }

        this.initialize();
    }

    setToken(token: string) {
        this.token = token;
        this.initialize();
    }

    initialize() {
        axios.defaults.baseURL = DEV_API_URL;

        if (this.token) {
            axios.defaults.headers = {
                Authorization: `Bearer ${this.token}`
            }

            this.sessions = sessions(this.axios);
            this.notify = notify(this.axios);
            this.twilio = twilio(this.axios);
            this.users = users(this.axios);
            this.utils = utils(this.axios);
        }

        this.axios = axios;
        this.auth = auth(this.axios);

        Api.instance = this;
    }
}