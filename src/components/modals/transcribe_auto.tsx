import * as React from 'React'
import { Picker } from 'react-native'
import CustomModal from '.';
import { Container, Button, Text, Textarea, Separator, Spinner, Toast } from 'native-base';

//@ts-ignore
import { AudioRecorder, AudioUtils } from 'react-native-audio'

//Actions
import { chatAddMessage } from '../../store/chat/actions'

//Types
import { NavigationScreenProp } from 'react-navigation';
import { connect } from 'react-redux';
import { StoreState } from '../../store';
import { View, StyleSheet, Platform } from 'react-native';
import Api from '../../api';
import { AxiosResponse } from 'axios';
import TwilioChat from '../../twilio/chat';
import { TwilioMessage } from '../../twilio/chat/types';

type Props = {
  navigation: NavigationScreenProp<any>,
  chatAddMessage(message: string): void,
}

type State = {
  isAuthorized: boolean,
  isRecording: boolean,
  currentTime: number,
  isTranscribing: boolean,
  transcription: string,
  translation: string,
  language: 'fr',
  error?: string,
}

const languages = [
  {
    name: 'French',
    code: 'fr',
  },
  {
    name: 'English',
    code: 'en',
  }
]

class TranscribeModal extends React.Component<Props, State> {
  private timer!: NodeJS.Timeout
  private maxRecording: number = 30000;
  constructor(props: Props) {
    super(props);

    this.state = {
      isAuthorized: false,
      isRecording: false,
      currentTime: 0,
      isTranscribing: false,
      transcription: '',
      translation: '',
      language: 'fr',
      error: undefined,
    }
  }

  prepareRecordingPath() {
    //Set audio path
    let audioPath = AudioUtils.DownloadsDirectoryPath + '/test.amr';
    console.log('Dir: ', audioPath);

    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 16000,
      Channels: 1,
      AudioQuality: "Low",
      AudioEncoding: "amr_wb",
      OutputFormat: 'amr_wb'
    });
  }

  componentDidMount() {
    AudioRecorder.requestAuthorization().then((isAuthorized: boolean) => {
      this.setState({ isAuthorized })

      if (!isAuthorized) {
        console.log('Recording not authorized.');
        return;
      };

      AudioRecorder.onProgress = (data: any) => {
        console.log('onProgress', data)
        this.setState({ currentTime: Math.floor(data.currentTime) });
      };

      AudioRecorder.onFinished = (data: any) => {
        // Android callback comes in the form of a promise instead.
        if (Platform.OS === 'ios') {
          console.log('Recording finished: ', data.status, data.audioFileURL, data.audioFileSize);
        }
      };
    });
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (this.state.error && this.state.error !== prevState.error) {
      Toast.show({
        position: 'top',
        text: this.state.error,
        textStyle: { textAlign: 'center' },
        duration: 3000,
        type: 'danger',
    })
    }
  }

  render() {
    const pickers = [
      languages.map(language => (
        <Picker.Item key={language.code} label={language.name} value={language.code} />
      ))
    ];

    return (
      <CustomModal close={this.close}>
        <Container style={styles.container}>
          <Text>{this.state.isRecording ? `Recording: ${this.state.currentTime}` : 'Press \"Record\" to start'}</Text>
          <Text note>Maximum recording length: {this.maxRecording / 1000} seconds</Text>
          <Textarea
            bordered
            rowSpan={2}
            style={styles.textArea}
            value={this.state.transcription}>
          </Textarea>
          <Picker
            selectedValue={this.state.language}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ language: itemValue })
            }>
            {pickers}
          </Picker>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Button onPress={this.toggleRecording} color='#7C91EC' style={styles.recBtn}>
              <Text>
                {this.state.isRecording ? 'Stop' : 'Record'}
              </Text>
            </Button>
          </View>
          {this.state.isTranscribing ? <Spinner size='large' color='#2E2f39' style={styles.spinner} /> : null}
        </Container>
      </CustomModal>
    )
  }

  toggleRecording = () => {
    this.state.isRecording ? this.stopRecording() : this.startRecording();
  }

  async startRecording() {
    if (this.state.isRecording) {
      console.warn('Already recording.');
      return;
    }

    if (!this.state.isAuthorized) {
      console.warn('Can\'t record, no permission granted!');
      return;
    }

    this.setState({ isRecording: true });

    try {
      this.prepareRecordingPath();

      const filePath = await AudioRecorder.startRecording();
      console.log("filePath: ", filePath);
    } catch (error) {
      console.error(error);
    }
  }

  async stopRecording() {
    if (!this.state.isRecording) {
      console.log('Not current recording.');
      return;
    }

    this.setState({ isRecording: false });

    try {
      AudioRecorder.stopRecording()
      .then((filePath: string) => {
        console.log('Recording finished: ', filePath);
        this.transcribe(filePath);
      })
      .catch((response: AxiosResponse) => {
        console.log('errResponse', response);
      })

    } catch (error) {
      console.log('error', error);
    }
  }

  transcribe(filePath: string) {
    this.setState({ isTranscribing: true });

    Api.instance.utils.transcribe(filePath)
      .then((res) => {
        this.setState({
          isTranscribing: false,
          transcription: res.data.transcription
        })

        console.log(res.data.transcription)
        return res.data.transcription;
      })
      .then((transcription) => {
        this.translate(transcription)
      })    
      .catch((response: AxiosResponse) => {
        console.log('error', response);
        this.setState({ error: "Unable to perform request. Try again later.", isTranscribing: false })
      })
  }

  translate = (text: string) => {
    Api.instance.utils.translate(text, this.state.language)
      .then((res) => {
        this.setState({ translation: res.data.translation })
        this.send(res.data.translation);
      }).catch((response: AxiosResponse) => {
        console.log('error', response);
      })
  }

  send = (text: string) => {
    const message: TwilioMessage = {
      payload: text,
      attributes: {
        type: 'TRANSLATION'
      }
    }

    TwilioChat.instance.sendMessageObject(message);
  }

  close = () => {
    this.props.navigation.navigate('Session');
    this.stopRecording();
  }
}

const mapStateToProps = (state: StoreState) => ({

})

const mapDispatchToProps = {
  chatAddMessage
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TranscribeModal)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '50%',
    padding: 15,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textArea: {
    width: '80%',
  },
  picker: {
    alignContent: 'center',
    justifyContent: 'center',
    height: 50,
    width: '50%',
    borderRadius: 5,
    borderColor: '#000',
    borderWidth: 5,
  },
  recBtn: {
    margin: 5,
    alignSelf: 'center',
    color: '#7C91EC',
  },
  spinner: {
    position: 'absolute',
  }
})
