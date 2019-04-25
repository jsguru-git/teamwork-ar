import * as React from 'react'
import { Body, Text, ListItem } from 'native-base';
import { StyleSheet } from 'react-native';

export const Notification = (props: { message: string }) => (
    <ListItem avatar style={styles.notification}>
        <Body>
            <Text>{props.message}</Text>
        </Body>
    </ListItem>
)

const styles = StyleSheet.create({
    notification: {
        width: '100%',
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10,
    }
})