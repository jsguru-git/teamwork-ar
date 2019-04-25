import * as React from 'react'

import {
    Text,
} from "native-base"
import { Image, TouchableWithoutFeedback, Platform } from 'react-native';

import { canvasSetScreenshot } from '../../../../store/session/actions';
import store from '../../../../store';

type IMessageBody = {
    loading?: boolean,
    image?: string,
    error?: any,
    body?: string,
}

export const MessageBody = (props: IMessageBody) => {
    if (props.loading) {
        return (
            <Text style={{fontWeight: 'bold'}}>Loading...</Text>
        )
    }
    if (props.image) {
        return (
            <TouchableWithoutFeedback onPress={() => handleImagePress(props.image!)}>
                <Image source={{ uri: Platform.OS === 'android' ? 'file://' + props.image : props.image }} style={{ height: 200 }} />
            </TouchableWithoutFeedback>
        )
    }
    if (props.body) {
        return (
            <Text>{props.body}</Text>
        )
    }
    if (props.error) {
        return (
            <Text>Error</Text>
        )
    }
    return null;
}

const handleImagePress = (path: string) => {
    store.dispatch(canvasSetScreenshot(path));
}

