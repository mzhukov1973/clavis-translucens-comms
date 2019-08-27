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
import   React                                                                   from "react"
import   Head                                                                    from "next/head"
import   Link                                                                    from "next/link"
import { Layout, Form, Select, InputNumber, DatePicker, Switch, Slider, Button } from "antd"
import   electron                                                                from "electron"
import   MyWorker                                                                from "../lib/my.worker"
import "antd/dist/antd.css"

const { Header, Content } = Layout
const { Item:FormItem }   = Form
const { Option }          = Select

class Home extends React.Component {
  ipcRenderer     = electron.ipcRenderer || false                                        /*<====Storage*/
  state           = {
    message: "",                /*<====Storage*/
    messages:[],                /*<====Storage*/
    latestWebWorkerMessage:null     /*<====Web-Worker*/
  }
  handleClick     = ev => {ev.preventDefault(); this.worker.postMessage("Hello");} /*<====Web-Worker*/
  onWorkerMessage = ev => this.setState({latestWebWorkerMessage:ev.data})          /*<====Web-Worker*/
  handleChange    = ev => this.setState({message:ev.target.value})                       /*<====Storage*/
  handleSubmit    = ev => {                                                              /*<====Storage*/
    ev.preventDefault()                                                                  /*<====Storage*/
    if (this.ipcRenderer) {                                                              /*<====Storage*/
      this.ipcRenderer.send("add-message", this.state.message)                           /*<====Storage*/
      this.setState({message:"", messages:[...this.state.messages, this.state.message]}) /*<====Storage*/
    }                                                                                    /*<====Storage*/
  }                                                                                      /*<====Storage*/


  componentDidMount = () => {
    if (this.ipcRenderer) {const messages=this.ipcRenderer.sendSync("get-messages"); this.setState({messages});} /*<====Storage*/
    this.worker = new MyWorker()                                  /*<====Web-Worker*/
    this.worker.addEventListener("message", this.onWorkerMessage) /*<====Web-Worker*/
  }

  componentWillUnmount = () => {
    this.worker.terminate()                                       /*<====Web-Worker*/
  }

  render = () => {
    const messages = []                              /*<====Storage*/
    for (let i=0;i<this.state.messages.length;i++) { /*<====Storage*/
      const message = this.state.messages[i]         /*<====Storage*/
      messages.push(<li key={i}>{message}</li>)      /*<====Storage*/
    }                                                /*<====Storage*/

    return (
      <React.Fragment>
       <Head>
        <title>Home - ClavisVitrea:Comms|ᵦ (with ant design, web-worker and storage)</title>
       </Head>
       <Header>
        <p>⚡ Electron + Next.js ⚡ - <Link href="/home"><a>Go to home page</a></Link> - <Link href="/next"><a>Go to next page</a></Link> - <Link href="/comms"><a>Go to comms page</a></Link></p>
       </Header>
       <Content style={{padding:48}}>
        <img src="/static/logo.ico"/>
        <hr/>
        <p><strong>Web-Worker</strong> stuff:</p>                                                                     {/*<====Web-Worker*/}
        <Button size="large" type="primary" onClick={this.handleClick}>Send a message to worker!</Button>             {/*<====Web-Worker*/}
        <h1>Message from Worker: <small><small><em>{this.state.latestWebWorkerMessage}</em></small></small></h1>      {/*<====Web-Worker*/}
        <hr/>                                                                                                         {/*<====Web-Worker*/}
        <p><strong>Storage stuff:</strong></p>                                               {/*<====Storage*/}
        <Form layout="horizontal" onSubmit={this.handleSubmit}>                              {/*<====Storage*/}
         <FormItem label="Enter a message to store:" labelCol={{span:8}} wrapperCol={{span:8}}>
{/*       <InputNumber size="large" min={1} max={10} style={{width:100}} defaultValue={3} name="msgToStore" value={this.state.message} onChange={this.handleChange}/> */}
          <input type="text" value={this.state.message} onChange={this.handleChange} name="msgToStore"/>
         </FormItem>
        </Form>                                                                              {/*<====Storage*/}
        <ul>{messages}</ul>                                                                  {/*<====Storage*/}
        <hr/>                                                                                {/*<====Storage*/}
        <p><strong>Ant Design</strong> stuff:</p>
        <Form layout="horizontal">
         <FormItem label="Input Number" labelCol={{span:8}} wrapperCol={{span:8}}><InputNumber size="large" min={1} max={10} style={{width:100}} defaultValue={3} name="inputNumber"/></FormItem>
         <FormItem label="Link" labelCol={{span:8}} wrapperCol={{span:8}}><a href="#">Link</a></FormItem>
         <FormItem label="Switch" labelCol={{span:8}} wrapperCol={{span:8}}><Switch defaultChecked name="switch"/></FormItem>
         <FormItem label="Slider" labelCol={{span:8}} wrapperCol={{span:8}}><Slider defaultValue={70}/></FormItem>
         <FormItem label="Select" labelCol={{span:8}} wrapperCol={{span:8}}>
          <Select size="large" defaultValue="lucy" style={{width:192}} name="select">
           <Option value="jack">jack</Option><Option value="lucy">lucy</Option><Option value="disabled" disabled>disabled</Option><Option value="yiminghe">yiminghe</Option>
          </Select>
         </FormItem>
         <FormItem label="DatePicker" labelCol={{span:8}}  wrapperCol={{span:8}}><DatePicker name="startDate"/></FormItem>
         <FormItem style={{marginTop:48}} wrapperCol={{span:8,offset:8}}><Button size="large" type="primary" htmlType="submit">OK</Button> <Button size="large" style={{marginLeft:8}}>Cancel</Button></FormItem>
        </Form>
       </Content>
      </React.Fragment>
    )
  }
}

export default Home
