import * as React from 'react'
import { connect } from 'react-redux';
import {
    NativeModules,
    findNodeHandle,
    requireNativeComponent,
    DeviceEventEmitter,
} from 'react-native';

const ARView = requireNativeComponent('ARViewManager');
import { toolbarSetTool, canvasSetScreenshot, sessionSetCommand } from '../../../store/session/actions'
import Commands from '../interface/chat/utils/commands'

import { Cords } from './types';
import { StoreState } from '../../../store';
import { SettingsState, CanvasState, Command } from '../../../store/session/types';
import { parseCords } from '../utils';
import { CurrentUserState } from '../../../store/users/types';
import TwilioChat from '../../../twilio/chat';

type Props = {
    onPress(cords: Cords): void;
    currentUser: CurrentUserState,
    twilioChat: TwilioChat,
    twilioToken: string,
    twilioId: string,
    tool: string,
    command: string,
    toolbarSetTool(name: string | undefined): void,
    canvasSetScreenshot(image: string): void,
    sessionSetCommand(command: string | undefined): void,
    settings: SettingsState,
    canvas: CanvasState
}

type State = {
    flipped: boolean
}

class Video extends React.Component<Props, State> {
    private ARView: any;
    private role: 'collaborator' | 'presenter' = 'collaborator';
    constructor(props: Props) {
        super(props);

        this.state = {
            flipped: false,
        }

        if (props.twilioId === props.currentUser._id) {
            this.role = 'presenter';
        }
        
        this.resetTool();
    }

    componentDidMount() {
        const { twilioId, twilioToken, settings } = this.props;

        if (twilioToken) {
            NativeModules.ARModule.joinRoom(this.role, twilioId, twilioToken, findNodeHandle(this.ARView));
        }

        if (settings.muted) {
            NativeModules.ARModule.toggleMute(settings.muted, findNodeHandle(this.ARView));
        }

        if (this.role === 'collaborator') {
            DeviceEventEmitter.addListener('onTapCords', (cords) => this.onTapCords(cords));
        } 

        DeviceEventEmitter.addListener('onScreenshot', (image) => this.setScreenshot(image));
    }

    componentWillUnmount() {
        if (this.role === 'collaborator') {
            DeviceEventEmitter.removeListener('onTapCords', (cords) => this.onTapCords(cords));
        }
        DeviceEventEmitter.removeListener('onScreenshot', (image) => this.setScreenshot(image));
    }

    componentDidUpdate(previousProps: Props) {
        const { settings, tool, command, canvas } = this.props;

        if (previousProps.settings.muted !== settings.muted) {
            NativeModules.ARModule.toggleMute(settings.muted, findNodeHandle(this.ARView));
        }

        if (previousProps.command !== command && command !== undefined) {
            if (this.role === 'presenter') {
                this.handleCommand(command);
            }    
        }

        if (tool && previousProps.tool !== tool) {
            switch (tool) {
                case 'circle':
                    if (this.role === 'presenter') {
                        NativeModules.ARModule.changeObjectModel(tool, findNodeHandle(this.ARView));
                        NativeModules.ARModule.setMinMaxScale(tool, 0, 1, findNodeHandle(this.ARView));
                        NativeModules.ARModule.changeDefaultColor(canvas.color, findNodeHandle(this.ARView));
                    } else {
                        //Currently just gets coordinates from listener and send command.
                    }
                case 'arrow':
                    if (this.role === 'presenter') {
                        NativeModules.ARModule.changeObjectModel(tool, findNodeHandle(this.ARView));
                        NativeModules.ARModule.setMinMaxScale(tool, 0, 1, findNodeHandle(this.ARView));
                        NativeModules.ARModule.changeDefaultColor(canvas.color, findNodeHandle(this.ARView));
                    } else {
                        //Currently just gets coordinates from listener and send command.
                    }
                    break;
                case 'undo':
                    if (this.role === 'presenter') {
                        NativeModules.ARModule.undoAnchor(findNodeHandle(this.ARView));
                    } else {
                        this.props.twilioChat.sendCommand('undo');
                    }
                    this.resetTool();
                    break;
                case 'redo':
                    if (this.role === 'presenter') {
                        NativeModules.ARModule.redoAnchor(findNodeHandle(this.ARView));
                    } else {
                        this.props.twilioChat.sendCommand('redo');
                    }
                    this.resetTool();
                    break;
                case 'pencil': 
                    this.resetTool();
                    break;
                case 'camera':
                    this.captureView();
                    this.resetTool();
                    break;
            }
        }
    }

    render() {
        return (
            <ARView ref={(ref: any) => this.ARView = ref} style={{ position: 'absolute', width: '100%', height: '100%' }} />
        )
    }

    captureView = () => {
        try {
            NativeModules.ARModule.videoCapture(findNodeHandle(this.ARView))
        } catch (error) {
            console.log(error);
        }
    }

    setScreenshot(image: string) {
        this.props.canvasSetScreenshot(image);
    }

    //Handles cords if user is a collaborator only.
    onTapCords(cords: any) {
        const { tool } = this.props;

        if (tool) {
            const command = Commands.getCommand(tool, parseCords(cords));
            this.props.twilioChat.sendCommand(command);
        }
    }

    handleCommand(command: Command) {
        const { canvas } = this.props;

        if (typeof command === 'string') {
            switch (command) {
                case 'undo':
                    NativeModules.ARModule.undoAnchor(findNodeHandle(this.ARView));
                    break;

                case 'redo':
                    NativeModules.ARModule.redoAnchor(findNodeHandle(this.ARView));
                    break;

                default:
                    break;
            }
        } else if (typeof command === 'object') {
            NativeModules.ARModule.changeObjectModel(command.obj, findNodeHandle(this.ARView))
            NativeModules.ARModule.setMinMaxScale(command.obj, 0, 1, findNodeHandle(this.ARView));
            NativeModules.ARModule.changeDefaultColor(canvas.color, findNodeHandle(this.ARView));
            
            setTimeout(() => {
                NativeModules.ARModule.placeObj(command.x, command.y, findNodeHandle(this.ARView));    
            }, 500); 
        } else {
            console.log('else command: ', command);
        }
        this.props.sessionSetCommand(undefined);
    }

    resetTool() {
        this.props.toolbarSetTool(undefined);
    }
}

const mapStateToProps = (state: StoreState) => ({
    currentUser: state.users.current,
    twilioChat: state.chat.twilioChat,
    twilioToken: state.twilio.token,
    twilioId: state.twilio.id,
    tool: state.session.toolbar.tool,
    command: state.session.command,
    settings: state.session.settings,
    canvas: state.session.canvas,
})

const mapDispatchToProps = {
    toolbarSetTool,
    canvasSetScreenshot,
    sessionSetCommand,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Video)
