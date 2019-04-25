import React from 'react'
import { createStackNavigator } from "react-navigation";

import MainDrawer from './drawer';
import InviteModal from '../../components/modals/invite'
import LogoutModal from '../../components/modals/logout'

const Main = createStackNavigator({
    MainDrawer,
    InviteModal,
    LogoutModal,
}, 
{
    mode: 'modal',
    headerMode: 'none',
    cardStyle: {
        backgroundColor: 'transparent',
        opacity: 1,
    },
    transparentCard: true,
    transitionConfig : () => ({
        containerStyle: {
          backgroundColor: 'transparent',
        }
      }),
})

export default Main