import * as React from 'react'
import { StyleSheet } from 'react-native';
import { Container } from 'native-base';

import Chat from './chat';
import Header from './header';
import Toolbar from './toolbar';

type Props = {
  isChatOpen: boolean,
}

export default class Interface extends React.Component<Props> {
  render() {
    if (this.props.isChatOpen) {
      return (
        <Container style={styles.container}>
          {this.props.children}
          <Chat/>
        </Container>
      )
      
    }

    return (
      <Container style={styles.container}>
        {this.props.children}
        <Header />
        <Toolbar />
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  }
})