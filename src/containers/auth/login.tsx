import * as React from 'react'
import { connect } from 'react-redux'

import { StyleSheet, KeyboardAvoidingView, Image, ActivityIndicator, StatusBar } from 'react-native'
import { Button, Form, Item, Input, Text, Toast, Container } from 'native-base'
import Orientation from 'react-native-orientation'
import Video from 'react-native-video'
import SplashScreen from 'react-native-splash-screen'

import { login, loginFailed } from '../../store/auth/actions'
import { getCurrentUser, getGroupUsers } from '../../store/users/actions';

//@ts-ignore
import styled from 'styled-components/native'

import { StoreState } from '../../store';
import { NavigationScreenProp } from 'react-navigation';
import Network from '../../utils/network';

import Api from '../../api';
new Api().initialize();

type Props = {
    navigation: NavigationScreenProp<any>,
    authLoading: boolean,
    usersLoading: boolean,
    authError?: any,
    usersError?: any,
    authToken?: string,
    login(email: string, password: string): void,
    loginFailed(): void,
    getCurrentUser(): Promise<void>,
    getGroupUsers(): Promise<void>,
    currentUser: any,
    groupUsers: any,
};

type State = {
    email: string,
    password: string,
    loading: boolean
};

//This component is a horrible mess and needs a lot tidying up. 
class Login extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            email: 'jp1@xp',
            password: '123',
            loading: false,
        }   
    }

    componentDidMount() {
        Orientation.lockToPortrait();
        new Network().initializeListener();  
        
        setInterval(() => {
            SplashScreen.hide();
        }, 1000)
    }

    componentDidUpdate(prevProps: Props) {
        const { authError, usersError , authToken, currentUser, groupUsers } = this.props;

        if (authError !== prevProps.authError || usersError !== prevProps.usersError) {
            Toast.show({
                position: 'bottom',
                text: authError ? 'Invalid Login, please try again.' : 'Unable to login, please try again later.',
                textStyle: { textAlign: 'center' },
                duration: 3000,
                type: 'danger',
            })

            this.setState({ loading: false });
        }

        //Once logged in; get user.
        if (prevProps.authToken !== authToken && authToken !== undefined) {
            Api.instance.setToken(authToken);
            this.props.getCurrentUser();
        }

        //Once logged in get users.
        if (prevProps.currentUser !== currentUser) {
            this.props.getGroupUsers();
        }

        //Once users are populated navigate to landing.
        if (groupUsers) {
            this.setState({ loading: false });
            this.props.navigation.navigate('Sessions');
        }
    }

    render() {
        const { authLoading, usersLoading } = this.props;

        return (
            <Screen>
                 <StatusBar backgroundColor='transparent' translucent={true} barStyle='light-content' />
                <Video
                    source={require('../../assets/media/background.mp4')}
                    rate={1.0}
                    resizeMode='cover'
                    repeat={true}
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#2E2f39'}}
                />
                <Wrapper>
                    <KeyboardAvoidingView>
                        {authLoading ? <ActivityIndicator size="large" color='#fff' style={styles.loadingIcon} /> : null}
                        <Image
                            source={require('../../assets/logos/logo.png')}
                            style={{ resizeMode: 'contain' }}
                        />
                        <LoginForm style={{ paddingTop: 30, paddingBottom: 30 }}>
                            <Item last>
                                <Input
                                    placeholder='Email'
                                    placeholderTextColor='#C3C3C3'
                                    textContentType='emailAddress'
                                    keyboardType='email-address'
                                    onChangeText={text => this.setState({ email: text })}
                                    style={{ color: '#fff' }}
                                />
                            </Item>
                            <Item last>
                                <Input
                                    placeholder='Password'
                                    placeholderTextColor='#C3C3C3'
                                    textContentType='password'
                                    secureTextEntry
                                    onChangeText={password => this.setState({ password })}
                                    style={{ color: '#fff' }}
                                />
                            </Item>
                        </LoginForm>
                        <Button onPress={this.login} style={{ backgroundColor: '#7C91EC' }} >
                            <Text style={{ width: '100%', textAlign: "center", fontSize: 16 }}>Login</Text>
                        </Button>
                    </KeyboardAvoidingView>
                </Wrapper>
            </Screen>
        )
    }

    login = () => {
        const { email, password } = this.state

        if (!email && !password) {
            this.props.loginFailed();
        }   
        
        if (!this.props.authLoading) {
            this.props.login(this.state.email, this.state.password)
        } 
    }
}

const mapStateToProps = (state: StoreState) => ({
    authLoading: state.auth.loading,
    usersLoading: state.users.loading,
    authError: state.auth.error,
    usersError: state.users.error,
    authToken: state.auth.token,
    groupUsers: state.users.groupUsers,
    currentUser: state.users.current,
})

const mapDispatchToProps = ({
    login,
    loginFailed,
    getCurrentUser,
    getGroupUsers,
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);

const styles = StyleSheet.create({
    loadingIcon: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    }
})

const Screen = styled(Container)`
    flex: 1;
    align-items: center;
    background: #2E2f39;
`

const Wrapper = styled(Container)`
    flex: 1;
    width: 300;
    justify-content: center;
    background: transparent;
`

const LoginForm = styled(Form)`
`