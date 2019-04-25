import * as React from 'react'
import Modal from 'react-native-modal';
import { Button, Text, Container, Content } from 'native-base';
import { StyleSheet, Dimensions, Platform } from 'react-native';
import CustomModal from '.';
import { NavigationScreenProp } from 'react-navigation';
import store from '../../store';

type Props = {
    navigation: NavigationScreenProp<any>,
}

const DisconnectModal = (props: Props) => (
    <CustomModal close={props.navigation.goBack}>
        <Container style={styles.container}>
            <Text>Disconnect from this session?</Text>
            <Container style={styles.buttons}>
                <Button
                    onPress={() => props.navigation.navigate('Main')}
                    style={styles.button}
                >
                    <Text style={{ fontSize: 16 }}>Yes</Text>
                </Button>
                <Button
                    onPress={() => props.navigation.navigate('Session')}
                    style={styles.button}
                >
                    <Text style={{ fontSize: 16 }}>No</Text>
                </Button>
            </Container>
        </Container>
    </CustomModal>
)

export default DisconnectModal

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center'
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
        alignSelf: 'center'
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
        backgroundColor: '#7C91EC',
    }
})