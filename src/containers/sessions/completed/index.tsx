import * as React from 'react'
import { connect } from 'react-redux';

import { List, View, Text, Container } from 'native-base';

import CompletedListItem from './item'

import { getCompletedSessions } from '../../../store/sessions/actions'

import { StoreState } from '../../../store';
import { CompletedSessionState } from '../../../store/sessions/types';
import { ScrollView } from 'react-native';
import moment from 'moment'

type Props = {
    searchText: string,
    getCompletedSessions(): void,
    completedSessions: any[],
}

class CompletedSessions extends React.Component<Props> {
  componentDidMount() {
    // setInterval(() => {
    //   this.props.getCompletedSessions();
    // }, 1000);
  }

  render() {
    const { completedSessions } = this.props

    const completedSessionListItems = completedSessions.map(session => {
      return <CompletedListItem session={session} key={session.id} callback={() => this.viewSession}/>
    })

    if (completedSessionListItems.length > 0) {
      return (
        <ScrollView>
          <List>
            {completedSessionListItems}
          </List>
        </ScrollView>
      )
    } else {
      return (
        <Container style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 32, textAlign: 'center', paddingHorizontal: 15}}>Completed sessions are not available.</Text>
        </Container>
      )
    }    
  }

  viewSession(id: string) {
    console.log(id);
  }
}

const mapStateToProps = (state: StoreState) => ({
  completedSessions: state.sessions.completed
})

const mapDispatchToProps = {
  getCompletedSessions
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CompletedSessions)

const tempSessions: CompletedSessionState[] = [{
  id: '5c33658397042a002313fba01',
  fullName: 'Bobby Bob',
  created: moment().subtract(30, 'minutes').toISOString(),
  ended: moment().toISOString()
},{
  id: '5c33658397042a002313fba02',
  fullName: 'Bobby Bob',
  created: moment().subtract(30, 'minutes').toISOString(),
  ended: moment().toISOString()
},{
  id: '5c33658397042a002313fba03',
  fullName: 'Bobby Bob',
  created: moment().subtract(30, 'minutes').toISOString(),
  ended: moment().toISOString()
},{
  id: '5c33658397042a002313fba04',
  fullName: 'Bobby Bob',
  created: moment().subtract(1.25, 'hours').toISOString(),
  ended: moment().toISOString()
},{
  id: '5c33658397042a002313fba05',
  fullName: 'Bobby Bob',
  created: moment().toISOString(),
  ended: moment().add('30', 'minutes').toISOString()
}]