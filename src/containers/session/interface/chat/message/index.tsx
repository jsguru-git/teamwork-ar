import * as React from 'react'
import { IMessage } from '../types';
import { Container, ListItem, Left, Thumbnail, Body, Right, Text } from 'native-base';
import { MessageBody } from '../messages';
import { StyleSheet } from 'react-native';

const defaultAvatar = require('../../../../../assets/misc/avatar.png');

interface Props extends IMessage {
}

type State = {
    loading: boolean,
    image?: string,
    error?: any,
}

export default class Message extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            loading: false,
        }
    }

    componentDidMount() {
        this.loadImage();
    }

  render() { 
    const { direction, avatar, username, body, timestamp } = this.props

    if (direction === 'outbound') {
        return (
            <ListItem avatar style={styles.itemRight} noBorder>
            <Left style={{paddingLeft: 10}}>
                <Thumbnail source={avatar ? avatar : defaultAvatar} style={{marginBottom: 10}}/>
            </Left>
            <Body>
                <Text style={{fontWeight: 'bold'}}>{username}</Text>
                <MessageBody {...this.state} body={body}/>
            </Body>
            <Right>
                <Text note>{timestamp}</Text>
            </Right>
            </ListItem>
        )
    } else {
        return (
            <ListItem avatar style={styles.itemLeft}>
                <Left style={{paddingLeft: 10}}>
                    <Thumbnail source={avatar ? avatar : defaultAvatar} style={{marginBottom: 10}}/>
                </Left>
                <Body>
                    <Text style={{fontWeight: 'bold'}}>{username}</Text>
                    <MessageBody {...this.state} body={body}/>
                </Body>
                <Right>
                    <Text note>{timestamp}</Text>
                </Right>
            </ListItem>
        )
    }
  }

  async loadImage() {
    if (this.props.fetchImage) {
        this.setState({ loading: true });

        this.props.fetchImage().then((image: string) => {
            this.setState({ image, loading: false })
        }).catch((error) => {
            this.setState({ error });
        })
    }
  }
}

const styles = StyleSheet.create({
    itemLeft: {
        flex: 1,
        width: '60%',
        backgroundColor: '#fff',
        alignItems: 'center',
        alignSelf: 'flex-start',
        justifyContent: 'center',
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 10,
    },
    itemRight: {
        width: '60%',
        backgroundColor: '#fff',
        alignItems: 'center',
        alignSelf: 'flex-end',
        justifyContent: 'center',
        marginTop: 5,
        marginRight: 10,
        marginBottom: 5,
    },
    notification: {
        width: '100%',
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10,
    }
})
