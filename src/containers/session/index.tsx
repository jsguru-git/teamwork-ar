import * as React from 'react'
import { connect } from 'react-redux'
import { StatusBar, StyleSheet, YellowBox, DeviceEventEmitter, TouchableWithoutFeedback } from 'react-native'
import { Container } from 'native-base'
import { withNavigation, NavigationScreenProp } from 'react-navigation'
import { AndroidBackHandler } from 'react-navigation-backhandler'
import Orientation from 'react-native-orientation'

import Video from './video'
import Canvas from './canvas'
import Interface from './interface'
import { chatConnect } from '../../store/chat/actions'
import { sessionSetMedia } from '../../store/session/actions'

import { StoreState } from '../../store'
import { ParticipantState } from '../../store/session/types'
import { CurrentUserState } from '../../store/users/types'
import TwilioChat from '../../twilio/chat'
import { MediaSession } from './interface/chat/utils/media';

type Props = {
  navigation: NavigationScreenProp<any>,
  error: any,
  currentUser: CurrentUserState,
  twilioId: string
  twilioToken: string,
  twilioChat: TwilioChat,
  chatConnect(twilioToken: string, twilioId: string, identity: string): void, 
  sessionSetMedia(mediaSession: MediaSession): void, 
  mediaSession: MediaSession,
  participants: ParticipantState[],
  isChatOpen: boolean,
  isScreenshot: boolean
}

class Scene extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
    
    YellowBox.ignoreWarnings(['Setting a timer']);
  }

  componentDidMount() {
    StatusBar.setHidden(true, 'fade');

    const { twilioToken, twilioId, chatConnect, currentUser, sessionSetMedia } = this.props
    chatConnect(twilioToken, twilioId, currentUser._id);

    const mediaSession = new MediaSession(currentUser._id, twilioId);
    sessionSetMedia(mediaSession)

    //Initialize Video here...
    Orientation.lockToLandscapeLeft();
    DeviceEventEmitter.addListener('onSessionDisconnect', () => {this.onSessionDisconnect()});
  }

  componentWillUnmount() {
    StatusBar.setHidden(false, 'fade');
    Orientation.unlockAllOrientations();

    const { twilioChat } = this.props;
    if (twilioChat) {
      twilioChat.leaveCurrentChannel();
    }

    this.props.mediaSession.RNFBSession.dispose();
  }

  render() {
    const { isChatOpen, currentUser, twilioChat, isScreenshot } = this.props;

    return (
      <Container>
        <Interface isChatOpen={isChatOpen}>
          <Video />
        </Interface>
        <Canvas identity={currentUser._id} sendMedia={(media) => twilioChat.sendMedia(media)}/>
        <AndroidBackHandler onBackPress={() => this.onBackButtonPressAndroid()} />
      </Container>
    )
  }

  onBackButtonPressAndroid() {
    //Close session and return to landing.
    this.props.navigation.navigate('Sessions');
    return true;
  }

  onSessionDisconnect() {
    this.props.navigation.navigate('Sessions');
  };
}

const mapStateToProps = (state: StoreState) => ({
  error: state.twilio.error,
  twilioId: state.twilio.id,
  twilioToken: state.twilio.token,
  twilioChat: state.chat.twilioChat,
  currentUser: state.users.current,
  participants: state.session.participants,
  isChatOpen: state.chat.isOpen,
  isScreenshot: !!state.session.canvas.screenshot,
  mediaSession: state.session.media,
})

const mapDispatchToProps = {
  chatConnect,
  sessionSetMedia,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(Scene));
