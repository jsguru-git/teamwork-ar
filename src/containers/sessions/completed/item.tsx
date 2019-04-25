import * as React from 'react'
import { ListItem, Left, Thumbnail, Body, Text, Right, Icon } from 'native-base'

import moment from 'moment'
//@ts-ignore
import momentDurationFormatSetup from 'moment-duration-format'
momentDurationFormatSetup(moment);

const avatar = require('../../../assets/misc/avatar.png')

import { CompletedSessionState } from '../../../store/sessions/types';

type Props = { 
    session: CompletedSessionState,
    callback(id: string): void,
}

const CompletedSessionItem = (props: Props) => {
    const { session, callback } = props;

    return (
        <ListItem avatar onPress={() => callback(session.id)}>
            <Left>
                <Thumbnail source={session.avatar ? session.avatar : avatar}/>
            </Left>
            <Body>
                <Text>{session.fullName}</Text>
                <Text note>{moment(session.created).format('LLLL')}</Text>
                <Text note>Duration: {getDuration(session.created, session.ended)}</Text>
            </Body>
            <Right style={{ justifyContent: 'center' }}>
                <Icon name="chevron-right" type='FontAwesome5' />
            </Right>
        </ListItem>
    )

    function getDuration(start: string, end: string) {
        const _start = moment(start);
        const _end = moment(end);

        //@ts-ignore
        const duration = moment.duration(_end.diff(_start, 'minutes'), 'minutes').format();
        return duration;
    }
}

export default CompletedSessionItem;