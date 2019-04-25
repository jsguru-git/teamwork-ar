import * as React from 'react'
import { connect } from 'react-redux';
import { ScrollView, TextInput, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, View } from 'react-native';
import { Container, List, Thumbnail, Text, Button } from 'native-base';
import { Notification } from './notifications';

const sendIcon = require('../../../../assets/buttons/send.png');
const sendIconTap = require('../../../../assets/buttons/send-tap.png');

import { toggleChat } from '../../../../store/chat/actions'

import { ChatState } from '../../../../store/chat/types';
import { StoreState } from '../../../../store';
import { CurrentUserState } from '../../../../store/users/types';
import Message from './message';
import { IMessage } from './types';
import { NavigationScreenProp, withNavigation } from 'react-navigation';

interface Props extends ChatState {
  navigation: NavigationScreenProp<any>,
  toggleChat(bool?: boolean): void,
  groupUsers: any[],
  twilioId: string,
  currentUser: CurrentUserState,
  messages: (IMessage | string)[],
}

type State = {
  message: string,
}

class Chat extends React.Component<Props, State> {
  private messageList: React.RefObject<ScrollView>;
  constructor(props: Props) {
    super(props);

    this.state = {
      message: '',
    }

    this.messageList = React.createRef();
  }

  render() {
    const { connected, loaded, messages, isTyping, groupUsers, twilioId, currentUser } = this.props;

    const messageItems: any[] = [];
    messages.forEach((message, i) => {
      if (typeof message === 'string') {
         messageItems.push(<Notification message={message} key={i} />)
      } else if (message.direction === 'outbound') {
        messageItems.push(<Message {...message} key={i} />)
      } else {
        const _message = Object.assign({}, message);
        if (groupUsers) {
          const user = groupUsers.filter(user => user._id === message.username)[0];
          _message.username = user.fullName
        }
        messageItems.push(<Message {..._message} key={i} />)
      }
    })

    const InviteButton = () => {
      if (twilioId === currentUser._id) {
        return (
          <Button onPress={() => this.props.navigation.navigate('InviteModal')} style={styles.inviteBtn} >
            <Text style={{ fontSize: 16 }}>Invite Users</Text>
          </Button>
        )
      }
      return null;
    }

    return (
      <Container style={styles.container}>
        <Container style={styles.header}>
          <View style={{ flex: 1 }}>
            {/* <Button transparent onPress={() => this.transcribe()} style={styles.micBtn}>
              <Thumbnail source={require('../../../../assets/buttons/mic-off.png')} style={styles.micBtn} />
            </Button> */}
          </View>
          <View style={{ flex: 1 }}>
            <InviteButton />
          </View>
          <View style={{ flex: 1 }}>
            <Button transparent onPress={() => this.handleChatClose()} style={styles.close} >
              <Thumbnail source={require('../../../../assets/buttons/close.png')} />
            </Button>
          </View>
        </Container>
        <Container style={styles.body}>
          {connected ?
            <ScrollView
              ref={this.messageList}
              onContentSizeChange={() => this.messageList.current ? this.messageList.current.scrollToEnd() : null}
            >
              <List >
                {messageItems}
              </List>
            </ScrollView>
            :
            <Text style={{ fontSize: 32, alignSelf: 'center', color: '#fff' }}>Not connected to chat.</Text>}
        </Container>
        <Container style={styles.footer}>
          {/* <Text>{isTyping ? "User is typing..." : null}</Text> */}
          <TextInput
            editable={connected}
            style={styles.input}
            onChangeText={(text) => {
              this.handleInput(text)
            }}
            value={this.state.message}
          />
          <TouchableWithoutFeedback onPressIn={() => this.sendMessage()}>
            <Thumbnail source={connected ? sendIcon : sendIconTap} style={styles.sendBtn} />
          </TouchableWithoutFeedback>
        </Container>
      </Container>
    )
  }

  transcribe() {
    this.props.navigation.navigate('TranscribeModal');
  }

  handleChatClose() {
    this.props.toggleChat()
  }

  handleInput(text: string) {
    this.setState({ message: text });

    const { twilioChat } = this.props
    if (twilioChat) {
      twilioChat.notifyTyping();
    }
  }

  sendMessage() {
    const { message } = this.state;
    const { twilioChat } = this.props;

    if (message && twilioChat) {
      twilioChat.sendMessage(message);
      this.setState({ message: '' });
    }
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent'
  },
  header: {
    flex: 1,
    maxHeight: 60,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(50, 50, 50, 0.65)',
  },
  body: {
    justifyContent: 'center',
    backgroundColor: 'rgba(50, 50, 50, 0.65)'
  },
  footer: {
    flex: 1,
    maxHeight: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C3C3C3',
  },
  messages: {

  },
  input: {
    flex: 1,
    height: 40,
    marginLeft: 20,
    backgroundColor: '#F4F4F4',
    fontSize: 18,
  },
  sendBtn: {
    margin: 15,
    height: 50,
    width: 50,
  },
  inviteBtn: {
    alignSelf: 'center',
    backgroundColor: '#7C91EC'
  },
  close: {
    paddingRight: 10,
    marginLeft: 'auto',
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  micBtn: {
    width: 45,
    height: 45,
    paddingLeft: 10,
  }
})

const mapStateToProps = (state: StoreState) => ({
  ...state.chat,
  participants: state.session.participants,
  groupUsers: state.users.groupUsers,
  twilioId: state.twilio.id,
  currentUser: state.users.current,
})

const mapDispatchToProps = {
  toggleChat,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withNavigation(Chat));