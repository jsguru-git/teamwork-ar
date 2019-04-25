import twilioChat, { Client } from 'twilio-chat'
import moment from 'moment'
import _ from 'underscore'

import {
    chatAddMessage,
    isTyping,
    chatLoading,
    chatLoaded
} from '../../store/chat/actions';
import { sessionSetCommand } from '../../store/session/actions';
import store from '../../store';

import { Channel } from 'twilio-chat/lib/channel';
import { Message } from 'twilio-chat/lib/message';
import { Member } from 'twilio-chat/lib/member';
import { Command } from '../../store/session/types';
import { parseCords } from '../../containers/session/utils';
import { Dimensions } from 'react-native';
import { MediaSession } from '../../containers/session/interface/chat/utils/media';
import { IMessage } from '../../containers/session/interface/chat/types';
import { TwilioMessage, TwilioMessageAttributeTypes, TwilioMessageAttributes } from './types';


const MESSAGES_HISTORY_LIMIT = 50;

export default class TwilioChat {
    static instance: TwilioChat;
    private chatClient!: Client;
    private channel!: Channel;
    private identity: string;
    constructor(identity: string) {
        this.identity = identity;

        if (TwilioChat.instance) {
            return TwilioChat.instance;
        }

        TwilioChat.instance = this;
    }

    connect(token: string, twilioId: string): Promise<this> {
        //Initialize the Programmable chat client
        return new Promise((resolve, reject) => {
            twilioChat.create(token)
                .then(async (client) => {
                    this.chatClient = client;
                    this.chatClient.on('tokenExpired', this.refreshToken);

                    try {
                        await this.findChannel(twilioId);
                    } catch (error) {
                        reject(error);
                    }
                    resolve(this);
                })
                .catch((error) => {
                    reject(error);
                });
        })
    }

    private refreshToken() {
        console.log('Token expired.');
        //Call API
        //this.chatClient.updateToken(token);
    }

    private async findChannel(twilioId: string): Promise<void> {
        console.log('Checking for existing channel...');
        return new Promise((resolve, reject) => {
            this.chatClient.getChannelByUniqueName(twilioId).then(async (channel: Channel) => {
                try {
                    await this.setupChannel(channel);
                } catch (error) {
                    reject(error);
                }
                resolve();
            }).catch(error => {
                if (error.message === 'Not Found') {
                    this.chatClient.createChannel({
                        uniqueName: twilioId
                    }).then(async (channel) => {
                        console.log('Created a new channel.', channel.uniqueName);
                        try {
                            await this.joinChannel(channel);
                        } catch (error) {
                            reject(error);
                        }
                        resolve();
                    }).catch((error) => {
                        console.log('joinDefaultChannel()', error)
                        reject(error);
                    });
                } else {
                    console.log('getChannelByUniqueName()', error)
                    reject(error);
                }
            })
        })
    }

    setupChannel(channel: Channel) {
        return new Promise((resolve, reject) => {
            this.leaveCurrentChannel()
                .then(async () => {
                    try {
                        await this.joinChannel(channel)
                    } catch (error) {
                        reject(error);
                    }
                    resolve();
                })
        })
    }

    initChannel() {
        console.log(`Connected to channel: ${this.channel.uniqueName}`);
        this.initChannelEvents();
        // this.loadMessages();
    }

    initChannelEvents() {
        this.channel.on('messageAdded', (message) => this.addMessage(message));
        this.channel.on('typingStarted', () => store.dispatch(isTyping(true)));
        this.channel.on('typingEnded', () => store.dispatch(isTyping(false)));
        this.channel.on('memberJoined', () => this.notifyMemberJoined);
        this.channel.on('memberLeft', () => this.notifyMemberLeft);
    }

    joinChannel(channel: Channel): Promise<void> {
        return new Promise((resolve, reject) => {
            if (channel.status === 'joined') {
                console.log('Joined channel: ' + channel.uniqueName);
                this.channel = channel;
                this.initChannel();
                resolve();
            } else {
                channel.join()
                    .then(async (channel) => {
                        console.log('Joined channel: ' + channel.uniqueName);
                        this.channel = channel;
                        this.initChannel();
                        resolve();
                    }).catch(error => {
                        console.log(`Unable to join channel: ${channel.uniqueName}`);
                        reject(error);
                    });
            }
        })
    }

    leaveCurrentChannel() {
        return new Promise((resolve, reject) => {
            if (this.channel) {
                this.channel.leave().then((leftChannel: any) => {
                    leftChannel.removeListener('messageAdded', () => this.addMessage);
                    leftChannel.removeListener('typingStarted', () => store.dispatch(isTyping(true)));
                    leftChannel.removeListener('typingEnded', () => store.dispatch(isTyping(false)));
                    leftChannel.removeListener('memberJoined', () => this.notifyMemberJoined);
                    leftChannel.removeListener('memberLeft', () => this.notifyMemberLeft);
                    console.log('Left channel: ' + leftChannel.uniqueName);
                    resolve()
                }).catch((error: any) => {
                    console.log('leaveCurrentChannel(): ', error);
                    reject(error);
                });
            } else {
                console.log('Not currently in a channel.')
                resolve();
            }
        })
    }

    sendMedia(media: FormData) {
        this.channel.sendMessage(media);

        // get channel's messages paginator
        this.channel.getMessages().then(function (messagesPaginator) {
            // check the first message type
            const message = messagesPaginator.items[0];
            if (message.type === 'media') {
                console.log('Message is media message');
                // log media properties
                console.log('Media attributes', message.media);
                // get media temporary URL for displaying/fetching
                message.media.getContentUrl().then(function (url) {
                    // log media temporary URL
                    console.log('Media temporary URL is ' + url);
                });
            }
        });
    }

    sendCommand(command: string) {
        if (command !== '') {
            this.channel.sendMessage(`2${command}`);
        }
    }

    sendMessage(message: string) {
        if (message !== '') {
            this.channel.sendMessage(`1${message}`);
        }
    }

    sendMessageObject(message: TwilioMessage) {
        if (message.payload !== '') {
            this.channel.sendMessage(message.payload, message.attributes);
        }
    }

    private loadMessages() {
        this.channel.getMessages(MESSAGES_HISTORY_LIMIT).then((paginator) => {
            paginator.items.forEach(message => {
                this.addMessage(message);
            });
            console.log('Messages loaded.');
        }).catch(error => {
            console.log('getMessages(): ', error);
        })
        store.dispatch(chatLoaded());
    }

    private async addMessage(message: Message) {
        console.log('message', message.attributes);
        //Verify message is a chat message with a "1" identifier.
        if (message.type === 'text') {
            const attributes = message.attributes as TwilioMessageAttributes;
            if (attributes.type === 'TRANSLATION') {

            }

            if (message.body !== null && message.body.startsWith("1")) {
                const data: IMessage = {
                    id: message.sid,
                    type: 'text',
                    direction: 'inbound',
                    username: message.author,
                    timestamp: moment(message.timestamp).format("H:mm:ss"),
                    body: message.body.substring(1)
                }

                if (message.author === this.identity) {
                    data.username = "You";
                    data.direction = 'outbound'
                }

                store.dispatch(chatAddMessage(data));
            } else if (message.body !== null && message.body.startsWith("2")) {
                var command: Command = message.body.substring(1);
                console.log(command);

                if (command.includes(',')) {
                    let parts: string[] = command.split(' ');

                    command = {
                        obj: parts[0],
                        x: parseFloat(parts[1].replace('(', '').replace(',', '')),
                        y: parseFloat(parts[2].replace(')', '')),
                    }
                }
                
                store.dispatch(sessionSetCommand(command))
            } else {
                console.log('else text', message.body)
            }
        } else if (message.type === 'media') {
            const data: IMessage = {
                id: message.sid,
                type: 'media',
                direction: 'inbound',
                username: message.author,
                timestamp: moment(message.timestamp).format("H:mm:ss"),
                body: message.body,
                fetchImage: () => {
                    return message.media.getContentUrl()
                    .then((url: string) => {
                        return MediaSession.fetchMedia(url, message.media.filename);
                    }).then((path: string) => {
                        return path;
                    })
                },
            }

            if (message.author === this.identity) {
                data.username = "You";
                data.direction = 'outbound'
            }

            store.dispatch(chatAddMessage(data));
        } else {
            console.log('else media', message.type);
        }
    }

    private notify(message: string) {
        console.log('Notification: ', message);
        store.dispatch(chatAddMessage(message));
    }

    notifyTyping() {
        _.throttle(() => {
            this.channel.typing();
        }, 1000);
    }

    private notifyMemberJoined(member: Member) {
        this.notify(`${member.identity} has joined the session.`)
    }

    private notifyMemberLeft(member: Member) {
        this.notify(`${member.identity} has left the session.`)
    }

    scrollToMessageListBottom() {
    }
}