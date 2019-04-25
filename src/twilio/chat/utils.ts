import { Message } from "twilio-chat/lib/message";

export const parseMessage = (message: Message) => {
    switch (message.type) {
        case 'text': 
            parseText(message);
            return;
        case 'media':
            parseMedia(message);
            return;
        default: 
            return;
    }
}

const parseText = (message: Message) => {
    
}

const parseMedia = (message: Message) => {

}