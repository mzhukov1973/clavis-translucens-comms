/*React************************************************************************/
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
import   React                    from 'react'
import   Head                     from 'next/head'
import   Link                     from 'next/link'
import { Button, Layout, Result } from 'antd'
import   commsWorker              from '../lib/comms.worker'
import 'antd/dist/antd.css'

const {Header,Content} = Layout

class Comms extends React.Component {
  state = {
    canvas: null,
    latestWebWorkerMessage: 'No messages so far...'
  }

  msgToCommsWorker = () => {
    this.worker.postMessage('[2]Hello[2]')
  }
  handleClick      = ev => {
    ev.preventDefault()
    this.msgToCommsWorker()
  }
  onWorkerMessage  = ev => {
    this.setState({latestWebWorkerMessage:ev.data})
  }

  componentDidMount = () => {
    this.setState({latestWebWorkerMessage:'[componentDidMount] Spawning comms worker...'})
    this.worker = new commsWorker()
    this.setState({latestWebWorkerMessage:'[componentDidMount] Comms worker spawned.'})
    this.setState({latestWebWorkerMessage:'[componentDidMount] Adding event listener to comms worker...'})
    this.worker.addEventListener('message', this.onWorkerMessage)
    this.setState({latestWebWorkerMessage:'[componentDidMount] Added event listener to the worker.'})
  }
  componentWillUnmount = () => {
    this.worker.removeEventListener('message', this.onWorkerMessage)
    this.worker.terminate()
  }

  render = () => (
    <React.Fragment>
     <Head>
      <title>Comms - ClavisVitrea:Comms|ᵦ (with ant design, web-worker and storage)</title>
     </Head>
     <Header>
      <p>⚡ Electron + Next.js ⚡ - <Link href='/home'><a>Go to home page</a></Link> - <Link href='/next'><a>Go to next page</a></Link> - <Link href='/comms'><a>Go to comms page</a></Link></p>
     </Header>
     <Content style={{padding:48}}>
      <h1>Message from commsWorker: <small><small><small><em>{this.state.latestWebWorkerMessage}</em></small></small></small></h1>
      <Button size='large' type='primary' onClick={this.handleClick}>Send a message to comms worker!</Button>
      <div className='canvasContainer'> {/* <==== A flex-based system goes here with 'pixels' colour defined by constituent <span>s or <div>s backgrounds. */}
       <div> {/* <==== A row (styled as a child #N of div.canvasContainer). */}
        <div></div><div></div><div></div><div></div><div></div> ...... <div></div><div></div><div></div><div></div><div></div> {/* <==== 'Pixels' (styled as a children (e.g. #M) of a row #N of div.canvasContainer). */}
       </div>
       <div>
        <div></div><div></div><div></div><div></div><div></div> ...... <div></div><div></div><div></div><div></div><div></div>
       </div>
       ......
       <div>
        <div></div><div></div><div></div><div></div><div></div> ...... <div></div><div></div><div></div><div></div><div></div>
       </div>
      </div>
     </Content>
    </React.Fragment>
  )
}

export default Comms
