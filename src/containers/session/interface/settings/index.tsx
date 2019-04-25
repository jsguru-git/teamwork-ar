import * as React from 'react'
import { connect } from 'react-redux';
import { NavigationScreenProp } from 'react-navigation';
import { Switch, StyleSheet, View, TouchableWithoutFeedback } from 'react-native'
import { Container, Button, Thumbnail, Content, List, ListItem, Text, Left, Right } from 'native-base';

import { toggleMute } from '../../../../store/session/actions';

import { SettingsState } from '../../../../store/session/types';
import { StoreState } from '../../../../store';
import { ColorButton } from '../../../../components/modals/color';
import { StrokeButton } from '../../../../components/modals/stroke';

type Props = {
  navigation: NavigationScreenProp<any>,
  muted: boolean,
  toggleMute(bool: boolean): void,
  color: string,
  stroke: number,
}

type State = {
  disconnectModal: boolean,
  colorModal: boolean,
}

class Settings extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      disconnectModal: false,
      colorModal: false,
    }
  }

  render() {
    const { muted, toggleMute } = this.props;

    return (
      <Container>
        <Content>
          <List>
            <ListItem itemDivider>
              <Text>Audio</Text>
            </ListItem>
            <ListItem>
              <Left>
                <Text>Mute: {muted ? 'ON' : 'OFF'}</Text>
              </Left>
              <Right>
                <Switch
                  value={muted}
                  onValueChange={() => toggleMute(!muted)}
                  thumbColor='#7C91EC'
                  trackColor={{
                    false: '#C3C3C3',
                    true: '#C3C3C3'
                  }}
                />
              </Right>
            </ListItem>
            <ListItem itemDivider>
              <Text>Objects/Canvas</Text>
            </ListItem>
            <ListItem>
              <Left>
                <Text>Color:</Text>
                <ColorButton onPress={this.toggleColorModal} color={this.props.color} />
              </Left>
            </ListItem>
            <ListItem>
              <Left>
                <Text>Stroke:</Text>
                <StrokeButton onPress={this.toggleStrokeModal} stroke={this.props.stroke} color={this.props.color} />
              </Left>
            </ListItem>
          </List>
          <Button onPress={this.toggleDisconnectModal} style={styles.disconnect} >
            <Text style={{ fontSize: 16 }}>Disconnect</Text>
          </Button>
        </Content>
      </Container>
    )
  }

  toggleDisconnectModal = () => {
    this.props.navigation.closeDrawer();
    this.props.navigation.navigate('DisconnectModal')
  }

  toggleColorModal = () => {
    this.props.navigation.closeDrawer();
    this.props.navigation.navigate('ColorModal');
  }

  toggleStrokeModal = () => {
    this.props.navigation.closeDrawer();
    this.props.navigation.navigate('StrokeModal');
  }
}

const mapStateToProps = (state: StoreState) => ({
  ...state.session.settings,
  ...state.session.canvas,
})

const mapDispatchToProps = {
  toggleMute
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings)

const styles = StyleSheet.create({
  disconnect: {
    bottom: 0,
    marginVertical: 10,
    backgroundColor: '#7C91EC',
    alignSelf: 'center',
  }
})