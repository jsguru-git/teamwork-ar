import * as React from 'react'
import { createDrawerNavigator, createStackNavigator, createSwitchNavigator } from 'react-navigation'

import Session from '../containers/session'
import Settings from '../containers/session/interface/settings'
import InviteModal from '../components/modals/invite'
import ColorModal from '../components/modals/color'
import StrokeModal from '../components/modals/stroke'
import TranscribeModal from '../components/modals/transcribe_auto'
import DisconnectModal from '../components/modals/disconnect'

const SessionDrawer = createDrawerNavigator({
    Session
}, {
    drawerWidth: 200,
    drawerPosition: 'right', 
    drawerLockMode: 'locked-closed',
    contentComponent: ({ navigation }) => (<Settings navigation={navigation}/>),
    defaultNavigationOptions: {
        headerTitle: 'Settings',
        headerTitleStyle: {
            color: '#fff'
        },
        headerStyle: {
            backgroundColor: '#2E2f39',
            shadowOpacity: 0,
            shadowRadius: 0,
            shadowOffset: {
                height: 0,
                width: 0,
            },
            elevation: 0,
        }
    }
})

const SessionModals = createSwitchNavigator({
    InviteModal,
    ColorModal,
    StrokeModal,
    TranscribeModal,
    DisconnectModal,
})

const SessionStack = createStackNavigator({
    SessionDrawer,
    SessionModals
}, {
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

export default SessionStack;