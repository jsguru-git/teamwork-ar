import { NetInfo, ConnectionInfo } from 'react-native'
// import speedTest from 'speedtest-net'

import store from '../store';

export default class Network {
    static instance: Network;
    constructor() {
        if (Network.instance) {
            return Network.instance;
        }

        Network.instance = this;
    }

    initializeListener() {
        //@ts-ignore | Deprecated types included, ignored.
        NetInfo.addEventListener('connectionChange', this.onConnectionChange);
    }

    removeListener() {
        //@ts-ignore | Deprecated types included, ignored.
        NetInfo.removeEventListener('connectionChange', this.onConnectionChange);
    }

    private onConnectionChange(connectionInfo: ConnectionInfo) {
        console.log('Network change.');
        console.log('Network Type: ', connectionInfo.type);
        console.log('Network EffectiveType: ', connectionInfo.effectiveType);
        // this.runSpeedTest();
        // store.dispatch()
    }

    private checkConnection() {
        //Checks if connection is metered.
        NetInfo.isConnectionExpensive()
            .then(isConnectionExpensive => {
                console.log('Connection is ' + (isConnectionExpensive ? 'Expensive' : 'Not Expensive'));
            }).catch((error) => {
                console.log('isConnectionExpensive(): ', error);
            })
    }

    // private runSpeedTest() {
    //     try {
    //         var test = speedTest({ maxTime: 5000 });

    //         test.on('data', data => {
    //             console.dir(data);
    //         });

    //         test.on('error', err => {
    //             console.error(err);
    //         });
    //     } catch (error) {
    //         console.log('runSpeedTest(): ', error)
    //     }
    // }




}