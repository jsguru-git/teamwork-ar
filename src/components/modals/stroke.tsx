import React from 'react';
import { connect } from 'react-redux';
import { Container, View } from 'native-base';
import { NavigationScreenProp } from 'react-navigation';

import {
    StyleSheet,
    Platform,
    TouchableWithoutFeedback,
    Text,
} from 'react-native';

import CustomModal from '.';

import tinycolor from 'tinycolor2'
import Slider from "react-native-slider";

import { canvasSetStroke } from '../../store/session/actions'
import { StoreState } from '../../store';

type Props = {
    navigation: NavigationScreenProp<any>,
    canvasSetStroke: (stroke: number) => void,
    stroke: number,
    color: string,
}

class StrokeModal extends React.Component<Props> {
    state = {
        stroke: this.props.stroke,
    };

    render() {
        return (
            <CustomModal close={this.close}>
                <Container style={styles.container}>
                    <View style={styles.content}>
                        <Text style={styles.componentText}>Stroke</Text>
                        <Slider
                            value={this.props.stroke}
                            step={2}
                            minimumValue={2}
                            maximumValue={30}
                            onValueChange={this.updateStroke}
                            style={styles.sliderRow}
                            trackStyle={{
                                backgroundColor: 'transparent',
                                borderStyle: 'solid',
                                borderLeftWidth: 400,
                                borderBottomWidth: 40,
                                borderLeftColor: 'transparent',
                                borderRightColor: 'transparent',
                                borderBottomColor: tinycolor(this.props.color).toHexString(),
                            }}
                            thumbStyle={{ bottom: 0, height: 40, width: 10, borderRadius: 0, backgroundColor: '#000' }}
                        />
                    </View>
                </Container>
            </CustomModal>
        );
    }

    updateStroke = val => this.setState({ stroke: val })

    close = () => {
        this.props.navigation.navigate('Session');
        this.props.canvasSetStroke(this.state.stroke);
    }
}

const mapStateToProps = (state: StoreState) => ({
    ...state.session.canvas
})

const mapDispatchToProps = {
    canvasSetStroke,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StrokeModal);

type StrokeButtonProps = {
    onPress: () => void,
    stroke: number,
    color: string
}

export const StrokeButton = (props: StrokeButtonProps) => {
    return (
      <TouchableWithoutFeedback onPress={props.onPress}>
        <Container style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', height: 20 }}>
          <View style={{
            width: props.stroke * 1.25,
            height: props.stroke * 1.25,
            borderRadius: props.stroke * 1.25 / 2,
            backgroundColor: '#000',
            alignSelf: 'center'
          }} />
        </Container>
      </TouchableWithoutFeedback>
    )
  }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        width: '75%',
        maxHeight: '50%',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingBottom: 32
    },
    componentText: {
        marginTop: 10,
        color: '#222',
        fontSize: 16,
        lineHeight: 15,
        ...Platform.select({
            android: {
                fontFamily: 'sans-serif-medium'
            },
            ios: {
                fontWeight: '600',
                letterSpacing: -0.408
            }
        })
    },
    sliderRow: {
        alignSelf: 'center',
        marginTop: 5
    },
})