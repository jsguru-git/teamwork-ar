import * as React from 'react'
import { connect } from 'react-redux';
import { Container, Tabs, Tab, Icon } from 'native-base'
import { NavigationScreenProps, NavigationScreenProp } from 'react-navigation'
import { AndroidBackHandler } from 'react-navigation-backhandler'
import Orientation from 'react-native-orientation'

import Notifications from '../notifications'
import Pending from './pending'
import Completed from './completed'
import Searchbar from '../../components/searchbar'

import { tokenReset } from '../../store/twilio/actions'

import { StoreState } from '../../store';
import { StyleSheet, TouchableNativeFeedback, KeyboardAvoidingView } from 'react-native'
import { CurrentUserState } from '../../store/users/types'
import Api from '../../api'

type Props = {
  navigation: NavigationScreenProp<any>,
  currentUser: CurrentUserState,
  groupUsers: any[],
  authToken: string
  twilioToken: string,
  tokenReset(): void,
}

type State = {
  searchText: string,
}

class Sessions extends React.Component<Props, State> {
  static navigationOptions = ({ navigation }: NavigationScreenProps) => {
    return {
      title: 'Sessions',
      headerLeft: () => (
        <TouchableNativeFeedback onPress={() => navigation.navigate('InviteModal')}>
          <Icon name="plus" type='MaterialCommunityIcons' style={{ paddingLeft: 15, color: '#fff' }} />
        </TouchableNativeFeedback>
      )
    }
  }

  constructor(props: Props) {
    super(props);

    this.state = {
      searchText: '',
    }

    Api.instance.setToken(props.authToken);
    props.tokenReset();
  }

  componentDidMount() {  
    Orientation.unlockAllOrientations();
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.twilioToken) {
      if (prevProps.twilioToken !== this.props.twilioToken) {
        this.props.navigation.navigate('Session');
      }
    }
  }

  render() {
    const { currentUser, navigation } = this.props

    var content: React.ReactElement<any>;
    if (currentUser.role === 'expert') {
      content = (
        <Tabs initialPage={0} style={styles.tabs} onChangeTab={this.onChangeTab}>
          <Tab heading="Pending" tabStyle={{ backgroundColor: '#2E2f39' }} activeTabStyle={{ backgroundColor: '#2E2f39' }} textStyle={{ color: '#fff' }} >
            <Pending navigation={navigation} searchText={this.state.searchText}/>
          </Tab>
          <Tab heading="Completed" tabStyle={{ backgroundColor: '#2E2f39' }} activeTabStyle={{ backgroundColor: '#2E2f39' }} textStyle={{ color: '#fff' }}>
            <Completed searchText={this.state.searchText}/>
          </Tab>
        </Tabs>
      )
    } else {
      content = (<Completed searchText={this.state.searchText}/>)
    }

    return (
      <Container>
        <Notifications/>
        <Searchbar value={this.state.searchText} onChange={(text) => this.setState({ searchText: text })}/>
        {content}
        <AndroidBackHandler onBackPress={this.handleBackPress} />
      </Container>
    )
  }

  handleBackPress = () => {
    this.props.navigation.navigate('LogoutModal');
    return true;
  }

  onChangeTab = () => {
    this.setState({ searchText: '' })
  }
}

const mapStateToProps = (state: StoreState) => ({
  currentUser: state.users.current,
  groupUsers: state.users.groupUsers,
  authToken: state.auth.token,
  twilioToken: state.twilio.token,
})

const mapDispatchToProps = {
  tokenReset,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Sessions);

const styles = StyleSheet.create({
  tabs: {
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    elevation: 0,
    borderBottomWidth: 0,
  }
})