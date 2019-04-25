import { ImageURISource } from "react-native";

export type IMessage = {
    id: string,
    type: 'text' | 'command' | 'media'
    direction: 'inbound' | 'outbound',
    avatar?: ImageURISource,
    username: string,
    body: string,
    timestamp: string,
    fetchImage?: () => Promise<string>,
}