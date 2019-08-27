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
import { app, ipcMain }               from "electron"
import   serve                        from "electron-serve"
import   * as Store                   from "electron-store"
import { createWindow, exitOnChange } from "./helpers"

const isProd = process.env.NODE_ENV === "production"
const store = new Store({name:"messages"}) /*<====Storage*/

if (isProd) {
  serve({directory:"app"})
} else {
  exitOnChange()
  const userDataPath = app.getPath("userData")
  app.setPath("userData", `${userDataPath} (development)`)
}

ipcMain.on("get-messages", (event,arg)=>{event.returnValue=store.get("messages")||[]})                                                   /*<====Storage*/
ipcMain.on("add-message",  (event,arg)=>{const messages=store.get("messages")||[]; messages.push(arg); store.set("messages",messages);}) /*<====Storage*/

;
(async () => {
  await app.whenReady()
  const mainWindow = createWindow("main", {frame:true,width:1000,height:600})
  if (isProd) {
    await mainWindow.loadURL("app://./home.html") /*"app://./home" <====Storage*/
  } else {
    const homeUrl = "http://localhost:8888/home"
    await mainWindow.loadURL(homeUrl)
    mainWindow.webContents.openDevTools()
  }
})()

app.on("window-all-closed", ()=>app.quit())
