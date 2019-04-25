import * as React from 'react'
import { connect } from 'react-redux'
import { View } from 'react-native';

import { StoreState } from '../../store';

type State = { email: string, password: string, group: string }
export class Register extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);

        this.state = {
            email: '',
            password: '',
            group: '',
        }
    }

    render() {
        return (
            <View></View>
        )
    }
}

const mapStateToProps = (state: StoreState) => ({
    error: state.auth.error,
    loading: state.auth.loading,
})

const mapDispatchToProps = {

}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Register)
