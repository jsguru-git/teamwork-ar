import { ImageURISource } from "react-native";

export type IUser = {
    id: string
    avatar?: ImageURISource,
    fullName: string,
    status?: IUserStatus
}

export type IUserStatus = 'active' | 'busy' | 'idle' | 'offline'