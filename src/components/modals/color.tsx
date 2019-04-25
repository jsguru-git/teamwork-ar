import React from 'react';
import { connect } from 'react-redux';
import { Container } from 'native-base';
import { NavigationScreenProp } from 'react-navigation';

import {
    StyleSheet,
    View,
    ScrollView,
    Platform,
    TouchableWithoutFeedback,
    Text,
} from 'react-native';

import CustomModal from '.';

import {
    HueSlider,
    LightnessSlider,
    SaturationSlider
} from 'react-native-color'

import tinycolor from 'tinycolor2'

import { canvasSetColor } from '../../store/session/actions'
import { StoreState } from '../../store';

type Props = {
    navigation: NavigationScreenProp<any>,
    canvasSetColor: (color: string) => void,
    color: string,
    recentColors: string[]
}

class ColorModal extends React.Component<Props> {
    state = {
        color: tinycolor(this.props.color).toHsl(),
    };

    render() {
        const { recentColors } = this.props

        const recentColorComponents = recentColors.map((recentColor, i) => {
            //Do not add eraser to recent colors.
            if (recentColor !== '#00000000') {
                return (
                    <TouchableWithoutFeedback key={i} onPress={() => this.setState({ color: tinycolor(recentColor).toHsl() })}>
                        <Container style={{ ...styles.recentColor, backgroundColor: recentColor }} />
                    </TouchableWithoutFeedback>
                )
            }
        })

        return (
            <CustomModal close={this.close}>
                <Container style={styles.container}>
                    <View
                        style={[
                            styles.header,
                            { backgroundColor: tinycolor(this.state.color).toHslString() }
                        ]}
                    >
                    </View>
                    <ScrollView contentContainerStyle={styles.content}>
                        <Text style={styles.componentText}>Hue</Text>
                        <HueSlider
                            style={styles.sliderRow}
                            gradientSteps={40}
                            value={this.state.color.h}
                            onValueChange={this.updateHue}
                        />
                        <Text style={styles.componentText}>Saturation</Text>
                        <SaturationSlider
                            style={styles.sliderRow}
                            gradientSteps={20}
                            value={this.state.color.s}
                            color={this.state.color}
                            onValueChange={this.updateSaturation}
                        />
                        <Text style={styles.componentText}>Lightness</Text>
                        <LightnessSlider
                            style={styles.sliderRow}
                            gradientSteps={20}
                            value={this.state.color.l}
                            color={this.state.color}
                            onValueChange={this.updateLightness}
                        />
                        <Container style={styles.recentColors}>
                            {recentColorComponents}
                        </Container>
                    </ScrollView>
                </Container>
            </CustomModal>
        );
    }

    updateHue = h => this.setState({ color: { ...this.state.color, h } });
    updateSaturation = s => this.setState({ color: { ...this.state.color, s } });
    updateLightness = l => this.setState({ color: { ...this.state.color, l } });

    close = () => {
        this.props.navigation.navigate('Session');
        this.props.canvasSetColor(tinycolor(this.state.color).toHexString());
    }
}

const mapStateToProps = (state: StoreState) => ({
    ...state.session.canvas
})

const mapDispatchToProps = {
    canvasSetColor,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ColorModal);

type ColorButtonProps = {
    onPress: () => void,
    color: string,
}

export const ColorButton = (props: ColorButtonProps) => {
    return (
        <TouchableWithoutFeedback onPress={props.onPress}>
            <Container style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', height: 20, paddingLeft: 15 }}>
                <Container style={{ height: 20, backgroundColor: props.color, borderRadius: 3, alignSelf: 'center' }} />
            </Container>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        width: '75%',
        alignSelf: 'center',
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: Platform.OS === 'ios' ? 20 : 0,
        paddingBottom: 16
    },
    content: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
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
        alignSelf: 'stretch',
        marginLeft: 12,
        marginTop: 5
    },
    recentColors: {
        flex: 1,
        width: '100%',
        maxHeight: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 7.5,
    },
    recentColor: {
        height: 60,
        maxWidth: 60,
        borderRadius: 3,
    }
});