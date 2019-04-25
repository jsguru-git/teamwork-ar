import * as React from 'react'
import { createStackNavigator } from "react-navigation"

import login from '../../containers/auth/login';

const Auth = createStackNavigator({
    Login: {
        screen: login
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

export default Auth