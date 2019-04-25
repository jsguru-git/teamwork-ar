import firebase from "react-native-firebase";
import { Platform, Alert } from "react-native";
import { Notification } from "react-native-firebase/notifications";

import { TwilioNotifyInvite } from "./types";
import store from "../../store";
import { getJoinToken } from "../../store/twilio/actions";

export const createChannel = () => {
    if (Platform.OS === 'android') {
        const channel = new firebase.notifications
            .Android.Channel('session_invites', 'Session Invites', firebase.notifications.Android.Importance.Max)
            .setShowBadge(true)
            .enableVibration(true)
            .enableLights(true)
            .setLightColor('#7C91EC')
            .setLockScreenVisibility(firebase.notifications.Android.Visibility.Public)
        firebase.notifications().android.createChannel(channel);
    }
}

export const buildNotification = (data: any): Notification => {
    console.log('notifyData', data)
    const notification = new firebase.notifications.Notification()
        .setNotificationId(data.twi_message_id)
        .setTitle(data.twi_title)
        .setBody(data.twi_body)
        .setData({
            session: data.room
        })

    if (Platform.OS === 'android') {
        notification
            .android.setChannelId('session_invites')
            .android.setSmallIcon('ic_launcher')
    } else if (Platform.OS === 'ios') {
        notification
            .ios.setBadge(1);
    }

    return notification;
}

export const buildTempNotification = (data: any): Notification => {
    const notification = new firebase.notifications.Notification()
        .setNotificationId(data.twi_message_id)
        .setTitle('Request for Expert')
        .setBody('A user has requested assistance.')
        .setData({
            session: data.room
        })

    if (Platform.OS === 'android') {
        notification
            .android.setChannelId('session_invites')
            .android.setSmallIcon('ic_launcher')
    } else if (Platform.OS === 'ios') {
        notification
            .ios.setBadge(1);
    }

    return notification;
}

export const displayNotification = (notification: Notification, authToken: string) => {
    firebase.notifications().displayNotification(notification);
    showAlert(notification, authToken)
}

export const showAlert = (notification: Notification, authToken: string) => {
    Alert.alert(
      notification.title, notification.body,
      [
          { text: 'Join', onPress: () => store.dispatch(getJoinToken(notification.data.session)) },
      ],
      { cancelable: true },
    )
}