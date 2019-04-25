import { createStackNavigator, createSwitchNavigator, createAppContainer } from "react-navigation";

import Login from "../containers/auth/login"

import Main from './main'
import Session from './session'

const Auth = createStackNavigator({
    Login: {
        screen: Login
    },
    // ResetLogin: {
    //     screen: ResetLogin
    // },
    // Register: {
    //     screen: register
    // }
}, 
{
    headerMode: "none"
});


const Root = createSwitchNavigator({
    Auth,
    Main,
    Session,
})

export default createAppContainer(Root);