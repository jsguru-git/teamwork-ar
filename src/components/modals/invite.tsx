import * as React from 'react'
import { connect } from 'react-redux';
import { ScrollView, StyleSheet } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import { 
    Container, 
    List,
    ListItem, 
    Left, 
    Thumbnail,
    Body, 
    Text, 
    Icon, 
    Right, 
    CheckBox,
    Button, 
    Content, 
    Header, 
} from 'native-base';

import { filterUsers } from '../../utils/users'
import { capitalizeFirstLetter } from '../../utils/strings';

import CustomModal from '.';
import Searchbar from '../../components/searchbar';

import Api from '../../api';
const avatar = require('../../assets/misc/avatar.png');

import { addInvite, removeInvite } from '../../store/session/actions';

import { CurrentUserState, GroupUserType } from '../../store/users/types';
import { StoreState } from '../../store';
import { getToken } from '../../store/twilio/actions';

type Props = {
    navigation: NavigationScreenProp<any>,
    currentUser: CurrentUserState,
    groupUsers: any[],
    twilioId: string,
    invites: string[],
    addInvite: (id: string) => void,
    removeInvite: (id: string) => void,
    getToken(identity: string): Promise<any>
}

type State = { 
    searchText: string,
    users: GroupUserType[],
}

class Invite extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            searchText: '',
            users: [],
        }  
    }

    static getDerivedStateFromProps(props: Props) {
      const { currentUser, groupUsers } = props;

        if (currentUser.role === 'fieldtech') {
            const users = groupUsers.filter((user: GroupUserType) => {
                return user.role === 'expert'
            })
            return { users } 
        }

      return { users: groupUsers }
    }

    render() {
        const { users, searchText } = this.state
        const { twilioId, invites, currentUser } = this.props;

        let _users = users;
        if (searchText) {
            _users = filterUsers(users, searchText);
        }

        const userListItems = _users.map((user: any) => {
            //Remove self from invite list.
            if (user._id === currentUser._id){
                return null;
            }

            return (
                <ListItem avatar key={user._id} style={{ marginRight: 15 }}>
                    <Left>
                        <Thumbnail source={user.avatar ? user.avatar : avatar} />
                    </Left>
                    <Body>
                        <Text>{user.fullName} ({capitalizeFirstLetter(user.role)})</Text>
                        <Text note>Status: Active</Text>
                    </Body>
                    <Right style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <CheckBox
                            color='#2E2f39'
                            checked={invites.includes(user._id)}
                            onPress={() => this.toggleInvite(user._id)}
                        />
                    </Right>
                </ListItem>
            )
        })

        const InviteButton = () => {
            //If in session
            if (twilioId) {
                return (
                    <Button onPress={this.sendInvites} style={{ backgroundColor: '#7C91EC', alignSelf: 'center' }} >
                        <Text style={{ fontSize: 16 }}>{invites.length <= 0 ? 'Cancel' : `Send ${invites.length} Invite(s)`}</Text>
                    </Button>
                )
            }
            return (
                <Button onPress={this.sendInvites} style={{ backgroundColor: '#7C91EC', alignSelf: 'center' }} >
                    <Text style={{ fontSize: 16 }}>{invites.length <= 0 ? 'Solo Session' : `Send ${invites.length} Invite(s)`}</Text>
                </Button>
            )
        }

        return (
            <CustomModal close={this.close}>
                <Container style={styles.container}>
                    <Header style={styles.header}>
                        <Left style={{ flex: 1 }}>
                            <Text style={{ color: '#fff', fontSize: 18 }}>Invite Users</Text>
                        </Left>
                        <Right>
                            <Icon name='close' type='MaterialCommunityIcons' style={{ color: '#fff' }} onPress={this.close} />
                        </Right>
                    </Header>
                    <Searchbar value={this.state.searchText} onChange={(text) => this.setState({ searchText: text })}/>
                    <Content>
                        <ScrollView>
                            <List>
                                {userListItems}
                            </List>
                        </ScrollView>
                    </Content>
                    <Container style={styles.footer}>
                        <InviteButton/>
                    </Container>
                </Container>
            </CustomModal>
        )
    }

    toggleInvite = (id: string) => {
        const { invites, addInvite, removeInvite } = this.props;

        if (invites.includes(id)) {
            removeInvite(id);
        } else {
            addInvite(id);
        }
    }

    sendInvites = () => {
        const { invites, twilioId } = this.props;

        if (twilioId) {
            this.close();
        } else {
            this.createSession();
        }

        invites.forEach(userId => {
            Api.instance.sessions.invite(twilioId, userId);
        })
    }

    createSession = () => {
        const { getToken, currentUser } = this.props;
        
        getToken(currentUser._id).then(this.close);
    }

    close = () => {
        const { twilioId, navigation } = this.props;
        
        if (twilioId) {
            navigation.navigate('Session');
        } else {
            navigation.goBack();
        }
    }
}

const mapStateToProps = (state: StoreState) => ({
    invites: state.session.invites,
    currentUser: state.users.current,
    twilioId: state.twilio.id,
    groupUsers: state.users.groupUsers,
})

const mapDispatchToProps = {
    addInvite,
    removeInvite,
    getToken,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Invite)

const styles = StyleSheet.create({
    container: {
    },
    header: {
        backgroundColor: '#2E2f39',
        elevation: 0,
    },
    footer: {
        maxHeight: 75,
        justifyContent: 'center',
    }
})