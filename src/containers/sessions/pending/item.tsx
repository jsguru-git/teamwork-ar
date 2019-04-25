import * as React from 'react'
import { View, ListItem, Left, Thumbnail, Body, Text, Right, Icon } from 'native-base'

const avatar = require('../../../assets/misc/avatar.png')
import Timer from '../../../components/timer'

import { PendingSessionState } from '../../../store/sessions/types';

type Props = { 
    session: PendingSessionState,
    callback(id: string): void,
}

const PendingSessionItem = (props: Props) => {
    const { session, callback } = props;
    
    return (
        <ListItem avatar onPress={() => callback(session.id)}>
            <Left>
                <Thumbnail source={session.avatar ? session.avatar : avatar}/>
            </Left>
            <Body>
                <Text>{session.fullName}</Text>
                <Text note>Queue Time: {<Timer startTime={session.created} />}</Text>  
            </Body>
            <Right style={{ justifyContent: 'center' }}>         
                <Icon name="chevron-right" type='FontAwesome5' />
            </Right>
        </ListItem>
    )
}

export default PendingSessionItem;