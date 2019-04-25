import * as React from 'react'
import { createStackNavigator } from "react-navigation";

import Sessions from '../../containers/sessions';
import { MenuButton } from "../../containers/menu";

const MainStack = createStackNavigator({
    Sessions,
}, 
{
    headerMode: 'float',
    headerLayoutPreset: "center",
    defaultNavigationOptions: {
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
        },
        headerRight: <MenuButton />,
    },
})

export default MainStack