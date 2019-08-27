/*JSX**************************************************************************/
/*  Copyright 2019 Maxim Zhukov                                               */
/*                                                                            */
/*  Licensed under the Apache License, Version 2.0 (the "License");           */
/*  you may not use this file except in compliance with the License.          */
/*  You may obtain a copy of the License at                                   */
/*                                                                            */
/*      http://www.apache.org/licenses/LICENSE-2.0                            */
/*                                                                            */
/*  Unless required by applicable law or agreed to in writing, software       */
/*  distributed under the License is distributed on an "AS IS" BASIS,         */
/*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  */
/*  See the License for the specific language governing permissions and       */
/*  limitations under the License.                                            */
/******************************************************************************/
import electron, { ipcRenderer } from "electron"

const getResponseChannels = channel => ({sendChannel:`%nextron-send-channel-${channel}`, dataChannel:`%nextron-response-data-channel-${channel}`, errorChannel:`%nextron-response-error-channel-${channel}`})
const getRendererResponseChannels = (windowId,channel) => ({sendChannel:`%nextron-send-channel-${windowId}-${channel}`, dataChannel:`%nextron-response-data-channel-${windowId}-${channel}`, errorChannel:`%nextron-response-error-channel-${windowId}-${channel}`})

export default class ipc {
  static callMain(channel, data) {
    return new Promise((resolve, reject) => {
      const {sendChannel, dataChannel, errorChannel} = getResponseChannels(channel)
      const cleanup = () => {ipcRenderer.removeAllListeners(dataChannel);ipcRenderer.removeAllListeners(errorChannel);}
      ipcRenderer.on(dataChannel, (event,result)=>{cleanup();resolve(result);})
      ipcRenderer.on(errorChannel, (event,error)=>{cleanup();reject(error);})
      ipcRenderer.send(sendChannel, data)
    })
  }

  static answerMain(channel, callback) {
    const window = electron.remote.getCurrentWindow()
    const {sendChannel, dataChannel, errorChannel} = getRendererResponseChannels(window.id, channel)
    ipcRenderer.on(sendChannel, async (event,data)=>{try {ipcRenderer.send(dataChannel, await callback(data))} catch (err) {ipcRenderer.send(errorChannel,err)}})
  }
}
