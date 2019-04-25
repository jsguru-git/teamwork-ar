import React from 'react'
import Modal from 'react-native-modal'
import { Dimensions, Platform } from 'react-native'
import ExtraDimension from 'react-native-extra-dimensions-android'

type Props = {
    close: () => void,
    style?: any,
}

export default class CustomModal extends React.Component<Props> {
    constructor(props: Props) {
        super(props);

    }

    render() {
        const deviceWidth = Dimensions.get("screen").width;
        const deviceHeight = Platform.OS === "ios" ? Dimensions.get("screen").height : ExtraDimension.get("REAL_WINDOW_HEIGHT");

        return (
            <Modal
                isVisible={true}
                deviceWidth={deviceWidth}
                deviceHeight={deviceHeight}
                onBackdropPress={this.props.close}
                onBackButtonPress={this.props.close}
                useNativeDriver={true}
                style={{
                    flex: 1, 
                     ...this.props.style}}
            >
                {this.props.children}
            </Modal>
        )
    }
}