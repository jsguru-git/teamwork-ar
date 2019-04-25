import * as React from 'react'
import { connect } from 'react-redux';

import { List, Container } from 'native-base';

import PendingListItem from './item'

import { getPendingSessions } from '../../../store/sessions/actions'
import { getJoinToken } from '../../../store/twilio/actions';

import { PendingSessionState } from '../../../store/sessions/types';
import { StoreState } from '../../../store';
import { ScrollView, Text, Alert } from 'react-native';
import { parseSession } from '../utils';
import { NavigationScreenProp } from 'react-navigation';
import { CurrentUserState } from '../../../store/users/types';
import { filterUsers } from '../../../utils/users';

type Props = {
  navigation: NavigationScreenProp<any>,
  currentUser: CurrentUserState,
  groupUsers: any[],
  getPendingSessions(): void,
  pendingSessions: any[],
  getJoinToken(identity: string): void,
  authToken: string,
  twilioToken: string,
  searchText: string,
}

class PendingSessions extends React.Component<Props, {}> {
  private interval!: NodeJS.Timeout;
  constructor(props: Props) {
    super(props);

    this.interval = setInterval(() => {
      props.getPendingSessions();
    }, 5000);
  }

  componentDidMount() {
    this.props.getPendingSessions();
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    const { pendingSessions, groupUsers, currentUser } = this.props;
    const pendingSessionListItems: any[] = [];
    
    pendingSessions.forEach((pendingSession: PendingSessionState) => {
      const session = parseSession(pendingSession, groupUsers);

      if (session.id !== currentUser._id) {
        pendingSessionListItems.push(<PendingListItem session={session} key={session.id} callback={(id) => this.joinSession(id)} />)
      }
    })

    if (pendingSessionListItems.length > 0) {
      return (
        <ScrollView>
          <List>
            {pendingSessionListItems}
          </List>
        </ScrollView>
      )
    } else {
      return (
        <Container style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 32 }}>No pending sessions.</Text>
        </Container>
      )
    }
  }

  joinSession(id: string) {
    this.props.getJoinToken(id);
  }
}

const mapStateToProps = (state: StoreState) => ({
  currentUser: state.users.current,
  pendingSessions: state.sessions.pending,
  groupUsers: state.users.groupUsers,
  authToken: state.auth.token,
  twilioToken: state.twilio.token,
})

const mapDispatchToProps = {
  getPendingSessions,
  getJoinToken
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PendingSessions)