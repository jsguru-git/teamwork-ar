import * as React from 'react'
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase';

import Notify from '../../api/notify';

import { RemoteMessage } from 'react-native-firebase/messaging';
import { NotificationOpen, Notification } from 'react-native-firebase/notifications';
import { CurrentUserState } from '../../store/users/types';
import store, { StoreState } from '../../store';
import { buildNotification, displayNotification, createChannel, buildTempNotification } from './utils';
import Api from '../../api';

type Props = {
    authToken: string,
    currentUser: CurrentUserState
}

class Notifications extends React.Component<Props> {
    private onTokenRefreshListener!: () => void;
    private messageListener!: ()=> void;
    private notificationListener!: ()=> void;
    private notificationOpenedListener!: ()=> void;
    private notificationDisplayedListener!: ()=> void;
    constructor(props: Props) {
        super(props);

        createChannel();
    }

    componentDidMount() {
        this.hasPermission();
    }

    componentWillUnmount() {
        this.onTokenRefreshListener();
        this.messageListener();
        this.notificationListener();
        this.notificationOpenedListener();
        this.notificationDisplayedListener();
    }

    render() { 
        this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(token => {
            if (Platform.OS === 'android') {
                this.registerFCMBinding(token)
            }
        })

        this.messageListener = firebase.messaging().onMessage((message: RemoteMessage) => {
            // Process your message as required
            console.log('message: ', message)

            var notification: Notification;
            if (message.data['twi_body']) {
                notification = buildNotification(message.data);
            } else {
                notification = buildTempNotification(message.data);
            }
            displayNotification(notification, this.props.authToken);
        });

        this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
            // Process your notification as required
            console.log('notificationListener: ', notification)
        });

        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
            // Get the action triggered by the notification being opened
            const action = notificationOpen.action;
            // Get information about the notification that was opened
            const notification: Notification = notificationOpen.notification;
            console.log('notificationOpened: ', notification);
            firebase.notifications().cancelAllNotifications();
            firebase.notifications().setBadge(0);
        });

        this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification: Notification) => {
            // Process your notification as required
            // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
            console.log('notificationDisplayed: ', notification)
        });

        firebase.notifications().getInitialNotification()
            .then((notificationOpen: NotificationOpen) => {
                if (notificationOpen) {
                    // App was opened by a notification
                    // Get the action triggered by the notification being opened
                    const action = notificationOpen.action;
                    // Get information about the notification that was opened
                    const notification: Notification = notificationOpen.notification;
                    console.log('notification: ', notification)
                }
            });

        return null
    }

    registerFCMBinding(fcmToken?: string) {
        const { currentUser } = this.props

        return new Promise(async (resolve, reject) => {
            try {
                if (!fcmToken) {
                    fcmToken = await this.getFCMToken();
                }
               
                if (fcmToken) {
                    await Api.instance.notify.register({
                        address: fcmToken,
                        bindingType: 'fcm',
                        tags: [currentUser.role, currentUser.group]
                    })
                    resolve();
                } else {
                    throw new Error('No FCM token.')
                }
            } catch (error) {
                console.log('registerFCMBinding(): ', error)
                reject(error);
            }
        })
    }

    hasPermission() {
        firebase.messaging().hasPermission()
            .then(enabled => {
                if (enabled) {
                    if (Platform.OS === 'android') {
                        this.registerFCMBinding();
                    }
                } else {
                    this.requestPermission();
                }
            })
            .catch((error) => {
                console.log('hasPermission(): ', error);            
            })
    }

    requestPermission() {
        firebase.messaging().requestPermission()
            .then(() => {
                if (Platform.OS === 'android') {
                    this.registerFCMBinding();
                }
            })
            .catch((error) => {
                console.log('requestPermission(): ', error);
            })
    }

    getFCMToken() {
        return firebase.messaging().getToken();
    }
}

const mapStateToProps = (state: StoreState) => ({
    authToken: state.auth.token,
    currentUser: state.users.current,
})

const mapDispatchToProps = {
  
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Notifications)

export const backgroundMessaging = (message: RemoteMessage) => {
    const notification = new firebase.notifications.Notification()
        .setNotificationId(message.data['twi_message_id'])
        .setTitle('Session Invitation')
        .setBody('A user invited you to a session.')
        .setData({
            session: message.data['room']
        })

    if (Platform.OS === 'android') {
        notification
            .android.setChannelId('session_invites')
            .android.setSmallIcon('ic_launcher')
    } else if (Platform.OS === 'ios') {
        notification
            .ios.setBadge(1);
    }

    firebase.notifications().displayNotification(notification);
    return Promise.resolve();
}