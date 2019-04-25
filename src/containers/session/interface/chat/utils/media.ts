import moment from 'moment'
import RNFB, { RNFetchBlobSession } from 'rn-fetch-blob'

type ImageTypes = 'stamp' | 'camera'

const dirs = RNFB.fs.dirs;
const directory = dirs.PictureDir + `/TeamworkAR`;
const dataUriPrefix = 'data:image/png;base64,'

export class MediaSession {
  private identity: string;
  private type: ImageTypes;
  private sessionId: string;
  public RNFBSession: RNFetchBlobSession;
  constructor(identity: string, sessionId: string) {
    this.identity = identity;
    this.type = 'camera';
    this.sessionId = sessionId;
    this.RNFBSession = RNFB.session(sessionId).add(`${directory}/.temp`);
  }

  get getDirectory(): string {
    return directory;
  }

  imageToFormData(filename: string): FormData {
    const data = new FormData();
    data.append('file', { uri: `file://${directory}/${filename}`, name: filename, type: 'image/png' });
    
    return data;
  }

  static async fetchMedia(url: string, filename: string): Promise<string> {
    //Assemble path and check/set format.
    let path = `${directory}/${filename}${filename.includes('.png') ? '' : '.png'}`;

    return RNFB
      .config({ path })
      .fetch('GET', url)
      .then((res) => {
        console.log('The file saved to ', res.path())
        return res.path();
      })
  }

  saveMediaFromBase64(base64: string): Promise<string> {
    const filename = `${this.type}__${this.identity}__${moment().valueOf().toString()}.png`;
    var path = dirs.PictureDir + `/TeamworkAR/${filename}`;

    return RNFB.fs.writeFile(path, base64, 'base64').then(() => filename)
  }

  cacheFetch(url: string) {
    RNFB.config({
      // you can also set session beforehand
      session: this.sessionId,
      fileCache: true
    })
    .fetch('GET', 'http://example.com/download/file')
    .then((res) => {
      // ...
    })  
  }
}