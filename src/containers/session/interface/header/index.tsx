import * as React from 'react'
import { StyleSheet } from 'react-native';
import { Container } from 'native-base';
import { withNavigation, NavigationScreenProp } from 'react-navigation';

import SettingsButton from '../settings/button';

type Props = { 
    navigation: NavigationScreenProp<any>,
}

class SceneHeader extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <Container style={styles.container}>          
                <SettingsButton
                    style={styles.settings} 
                    navigation={this.props.navigation} />
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        maxHeight: 60,
        flexDirection: 'column',
        backgroundColor: 'transparent',
    },
    settings: {     
      paddingRight: 10,
      alignSelf: 'flex-end',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    }
  })

  export default withNavigation(SceneHeader);
