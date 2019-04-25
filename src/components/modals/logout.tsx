import * as React from 'react'
import { StyleSheet } from 'react-native';
import { Button, Text, Container } from 'native-base';
import { NavigationScreenProp } from 'react-navigation';

import CustomModal from '.';

import { logout } from '../../store/auth/actions'
import store from '../../store';

type Props = {
    navigation: NavigationScreenProp<any>,
}

const LogoutModal = (props: Props) => (
    <CustomModal close={props.navigation.goBack} style={{}}>
        <Container style={styles.container}>
            <Text>Logout of Teamwork AR?</Text>
            <Container style={styles.buttons}>
                <Button
                    onPress={() => {
                        props.navigation.navigate('Auth');
                        store.dispatch(logout());
                    }}
                    style={styles.button}
                >
                    <Text style={{ fontSize: 16 }}>Yes</Text>
                </Button>
                <Button
                    onPress={() => props.navigation.goBack()}
                    style={styles.button}
                >
                    <Text style={{ fontSize: 16 }}>No</Text>
                </Button>
            </Container>
        </Container>
    </CustomModal>
)

export default LogoutModal

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
    },
    container: {
        maxHeight: 200,
        maxWidth: 400,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    text: {
        fontSize: 32,
        alignSelf: 'center',
    },
    buttons: {
        maxHeight: 50,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginVertical: 15,
    },
    button: {
        marginHorizontal: 20,
        backgroundColor: '#7C91EC'
    }
})