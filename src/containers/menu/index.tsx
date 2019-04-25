import * as React from 'react'
import { connect } from 'react-redux';
import { NavigationScreenProp, withNavigation } from 'react-navigation'
import { Container, List, ListItem, Icon, Button, Text } from 'native-base'

import { logout } from '../../store/auth/actions'

import { StoreState } from '../../store';
import LogoutModal from '../../components/modals/logout';

type Props = {
  navigation: NavigationScreenProp<any>,
}

type State = {
}

class Menu extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
    }
  }

  render() {
    return (
        <Container>
          {/* <List>
            <ListItem>

            </ListItem>
          </List> */}
          <Button onPress={() => this.props.navigation.navigate('LogoutModal')} style={{ backgroundColor: '#7C91EC', alignSelf: 'center', marginTop: 15 }} >
            <Text style={{ fontSize: 16 }}>Logout</Text>
          </Button>
        </Container>
    )
  }
}

const mapStateToProps = (state: StoreState) => ({
  
})

const mapDispatchToProps = {
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Menu)

type MenuButtonProps = { navigation: NavigationScreenProp<any> }
const _MenuButton = (props: MenuButtonProps) => (
  <Icon 
    name='menu' 
    type='MaterialCommunityIcons' 
    style={{paddingRight: 15, color: '#fff'}} 
    onPress={() => props.navigation.openDrawer()}
  />
)

const MenuButton = withNavigation(_MenuButton);

export { MenuButton }
