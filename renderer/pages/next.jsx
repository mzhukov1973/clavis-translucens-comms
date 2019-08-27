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
import   React            from "react"
import   Head             from "next/head"
import   Link             from "next/link"
import { Layout, Result } from "antd"
import "antd/dist/antd.css"

const {Header,Content} = Layout

export default () => (
  <React.Fragment>
   <Head>
    <title>Home - ClavisVitrea:Comms|ᵦ (with ant design, web-worker and storage)</title>
   </Head>
   <Header>
    <p>⚡ Electron + Next.js ⚡ - <Link href="/home"><a>Go to home page</a></Link> - <Link href="/next"><a>Go to next page</a></Link> - <Link href="/comms"><a>Go to comms page</a></Link></p>
   </Header>
   <Content style={{padding:48}}>
    <Result status="success" title="Nextron" subTitle="with Ant Design, Storage and Web-Workers"/>
   </Content>
  </React.Fragment>
)
