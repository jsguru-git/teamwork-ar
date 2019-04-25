import * as React from 'react'
import { Container, Button, Thumbnail } from "native-base";
import { NavigationScreenProp } from "react-navigation";

import actions from '../toolbar/assets/actions';

type ButtonProps = { style?: any, navigation: NavigationScreenProp<any> }
const SettingsButton = (props: ButtonProps) => (
  <Container style={props.style}>
    <Button transparent onPress={() => props.navigation.openDrawer()} >
      <Thumbnail source={actions.settings.icon} />
    </Button>
  </Container>
)

export default SettingsButton