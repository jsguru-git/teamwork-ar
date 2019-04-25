import * as React from 'react'
import { Text } from 'react-native'

import moment from 'moment'
//@ts-ignore
import momentDurationFormatSetup from 'moment-duration-format'
momentDurationFormatSetup(moment);

type Props = { startTime?: string }
type State = { secondsElapsed: number }

export default class Timer extends React.Component<Props, State> {
    private interval!: NodeJS.Timeout
    constructor(props: Props) {
        super(props);

        this.state = {
            secondsElapsed: 1,
        };
    }

    componentDidMount() {
        if (this.props.startTime) {
            const created = moment(this.props.startTime);
            const seconds = moment().diff(created, 'seconds');

            if (seconds > 0) {
                this.setState({ secondsElapsed: seconds });
            }
        }

        this.interval = this.start();
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    start() {
        return setInterval(() =>
            this.setState({
                secondsElapsed: this.state.secondsElapsed + 1
            })
            , 1000);
    }

    render() {
        return(
            //@ts-ignore
            <Text>{moment.duration(this.state.secondsElapsed, 'seconds').format()}</Text>
        )
    }
}
