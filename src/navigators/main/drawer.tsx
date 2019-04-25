import * as React from 'react'
import { createDrawerNavigator } from "react-navigation"

import MainStack from './stack';
import Menu from "../../containers/menu"

const MainDrawer = createDrawerNavigator({
    MainStack
}, {
    drawerWidth: 200,
    drawerPosition: 'right', 
    drawerLockMode: 'locked-closed',
    contentComponent: ({ navigation }) => (<Menu navigation={navigation}/>),  
})

export default MainDrawer