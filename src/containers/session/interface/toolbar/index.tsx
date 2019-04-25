import * as React from 'react'
import { connect } from 'react-redux';
import { StyleSheet, TouchableWithoutFeedback, Alert } from 'react-native'
import { NativeModules, NativeEventEmitter } from 'react-native'
import { Container, Thumbnail, View } from 'native-base'

import { toolbarSetTool } from '../../../../store/session/actions'
import { toggleChat } from '../../../../store/chat/actions'

import tools from './assets/tools'

import { Tool } from './types'
import { StoreState } from '../../../../store';
const myModuleEvt = new NativeEventEmitter(NativeModules.MyModule)

type Props = {
    tool: string | undefined,
    toolbarSetTool(name: string | undefined): void,
    toggleChat(bool?: boolean): void,
}

class Toolbar extends React.Component<Props> {

    componentDidMount(){
        myModuleEvt.addListener('reset_tool', () => this.resetTool());
    }

    componentWillMount(){
        myModuleEvt.removeListener('reset_tool', () => this.resetTool());
    }

    render() {
        const items = tools.map((tool) => {
            return (
                <TouchableWithoutFeedback
                    onPress={() => this.handlePress(tool)} 
                    key={tool.name}
                >
                    <Thumbnail source={this.props.tool === tool.name ? tool.icon_tap : tool.icon}/>
                </TouchableWithoutFeedback>
            )
        });

        return (
            <Container style={styles.container}>
                {items}
            </Container>
        )
    }

    handlePress = (tool: Tool) => {
        if (tool.name === 'chat') {
            this.props.toggleChat();
        } else {
            this.props.toolbarSetTool(tool.name);
        }
    }

    resetTool(){
        this.props.toolbarSetTool(undefined);
    }

}

const mapStateToProps = (state: StoreState) => ({
  tool: state.session.toolbar.tool
})

const mapDispatchToProps = {
    toggleChat,
    toolbarSetTool,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Toolbar)

const styles = StyleSheet.create({
    container: {
        width: '100%',
        maxHeight: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: '#C3C3C3',
        paddingLeft: '15%',
        paddingRight: '15%',
    },
})
