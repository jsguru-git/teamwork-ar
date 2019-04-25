import * as React from 'react'

import { 
  Container,
  Header as _Header,
  Title, 
  Button,
  Left, 
  Right, 
  Body, 
  Icon 
} from 'native-base';

type Props = { navigation: any }
export default class Header extends React.Component<Props, {}> {
  render() {
    return (
      <Container>
        <_Header androidStatusBarColor='red'>
          <Left>
            <Button transparent onPress={() => this.props.navigation.navigate("DrawerOpen")}>
              <Icon name='menu' />
            </Button>
          </Left>
          <Body>
            <Title>Teamwork AR</Title>
          </Body>
          <Right />
        </_Header>
      </Container>
    )
  }
}
