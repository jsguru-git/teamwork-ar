import * as React from 'react'
import { connect } from 'react-redux';
import { StyleSheet, Image, View } from 'react-native'
import { NavigationScreenProp, withNavigation } from 'react-navigation';
import { Container, Text, Button, Thumbnail } from 'native-base';

//@ts-ignore
import { SketchCanvas } from '@terrylinla/react-native-sketch-canvas';
import ViewShot from 'react-native-view-shot'
import tinycolor from 'tinycolor2'

import SettingsButton from '../interface/settings/button';
import CanvasToolbar from './toolbar';

import {
  canvasSetScreenshot,
  canvasSetImage,
  canvasSetColor,
  canvasSetStroke,
} from '../../../store/session/actions';

import { StoreState } from '../../../store';
import { Action } from '../interface/toolbar/assets/actions';
import { MediaSession } from '../interface/chat/utils/media';
import { TOOL_MARKER_THIN, TOOL_ERASER, Tools } from './tools';

type Props = {
  navigation: NavigationScreenProp<any>,
  identity: string;
  sendMedia(media: FormData): void;
  canvasSetScreenshot(uri: string | undefined): void;
  canvasSetImage(uri: string | undefined): void;
  canvasSetColor(color: string): void;
  canvasSetStroke(stroke: number): void;
  mediaSession: MediaSession;
  color: string,
  stroke: number,
  screenshot: string,
}

type State = {
  tool: Tools,
}

class Canvas extends React.Component<Props, State> {
  private ViewShot: any;
  private SketchCanvas: any;
  constructor(props: Props) {
    super(props);

    this.state = {
      tool: TOOL_MARKER_THIN,
    }

    this.ViewShot = React.createRef();
    this.SketchCanvas = React.createRef();
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.color !== prevProps.color) {
      //If the color has been changed and it is not the color of the eraser, change the tool to default.
      if (this.props.color !== '#00000000'){
        if (this.state.tool === Tools.eraser) {
          this.setState({ tool: Tools.marker_thin });
        }
      }
      
    }
  }

  render() {
    const { screenshot, color, stroke } = this.props;

    if (screenshot) {
      var uri: string;
      if (screenshot.includes('camera')) {
        uri = `file://${screenshot}`;
      } else {
        uri = `data:image/png;base64,${screenshot}`
      }

      return (
        <Container style={styles.container}>
          <ViewShot ref={(ref: any) => this.ViewShot = ref} options={{ format: 'png', result: 'base64' }} style={{ position: 'absolute', width: '100%', height: '100%' }}>
            <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
              <Image source={{ uri }} style={{ position: 'absolute', width: '100%', height: '100%' }} />
              <SketchCanvas
                ref={(ref) => this.SketchCanvas = ref}
                style={[styles.canvas]}
                strokeColor={tinycolor(color).toHex8String()}
                strokeWidth={stroke}
              />
            </View>
          </ViewShot>
          <View style={{flex: 1, flexDirection: 'row', maxHeight: 60}}>
            <View style={{flex: 1}}></View>
            <View style={{width: 250, flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between'}}>
              <Button transparent onPress={() => this.SketchCanvas.undo()}>
                <Thumbnail source={require('../../../assets/toolbar_icons/undo.png')} />
              </Button>
              <Button onPress={() => this.SketchCanvas.clear()} style={styles.clear} >
                <Text style={{ fontSize: 16 }}>Clear</Text>
              </Button>
              <Button transparent onPress={this.redo} disabled>
                <Thumbnail source={require('../../../assets/toolbar_icons/redo.png')} style={{ opacity: 0.5 }} />
              </Button>
            </View>
            <View style={{flex: 1}}>
              <SettingsButton navigation={this.props.navigation} style={styles.settings} />
            </View>
            </View>
          <CanvasToolbar
            tool={this.state.tool}
            toolCallback={this.toolCallback}
            color={this.props.color}
            colorCallback={this.colorCallback}
            handlePress={this.handleAction} />
        </Container>
      )
    }
    return null;
  }

  clear = () => {

  }

  redo = () => {

  }

  undo = () => {

  }

  toolCallback = (tool: Tools, stroke: number) => {
    this.setState({ tool });
    this.props.canvasSetStroke(stroke);

    if (tool === Tools.eraser) {
      this.props.canvasSetColor('#00000000');
    } else {
      this.props.canvasSetColor(this.props.color);
    }
  }

  colorCallback = (color: string) => {
    this.props.canvasSetColor(color);

    if (this.state.tool === Tools.eraser) {
      this.setState({ tool: Tools.marker_thin})
    } 
  }

  handleAction = (action: Action) => {
    switch (action.name) {
      case 'cancel':
        this.props.canvasSetScreenshot(undefined);
        break;

      case 'confirm':
        this.takeImage()
          .then(() => {
            this.props.canvasSetScreenshot(undefined);
          });
        break;

      default:
        break;
    }
  }

  takeImage = () => {
    return new Promise((resolve, reject) => {
      this.ViewShot.capture()
        .then((uri: string) => {
          this.props.canvasSetImage(uri);

          const { mediaSession, sendMedia } = this.props;
          mediaSession.saveMediaFromBase64(uri)
            .then((filename: string) => {
              let media = mediaSession.imageToFormData(filename);
              sendMedia(media);
            })
            .catch((error: any) => {
              console.log(error);
            })
          resolve();
        }).catch((error: any) => {
          console.log('error', error);
        });
    })
  }
}

const mapStateToProps = (state: StoreState) => ({
  ...state.session.canvas,
  mediaSession: state.session.media,
})

const mapDispatchToProps = {
  canvasSetScreenshot,
  canvasSetImage,
  canvasSetColor,
  canvasSetStroke,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withNavigation(Canvas))

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  canvas: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  header: {

  },
  clear: {
    alignSelf: 'center',
    backgroundColor: '#7C91EC'
  },
  settings: {
    left: 0,
    marginHorizontal: 10,
    marginVertical: 10,
    alignSelf: 'flex-end',
    backgroundColor: 'transparent',
  }
});