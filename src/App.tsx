import * as React from 'react'
import { Root } from 'native-base';
import { Provider } from 'react-redux';

import {
  Container
} from 'native-base'

import Navigator from './navigators'
import store from './store'

export default class App extends React.Component {
  render() {
    return (
      <Root>
        <Provider store={store}>
          <Container>
            <Navigator />
            {/* <Modals> */}
          </Container>
        </Provider>
      </Root>
    )
  }
}