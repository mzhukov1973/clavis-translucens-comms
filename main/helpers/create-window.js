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
import { screen, BrowserWindow } from "electron"
import   * as Store              from "electron-store"

export default function createWindow(windowName, options) {
  const key         = "window-state"
  const name        = `window-state-${windowName}`
  const store       = new Store({name})
  const defaultSize = {width:options.width, height:options.height}
  let state         = {}
  let win

  const restore = () => store.get(key,defaultSize)

  const getCurrentPosition = () => {
    const position = win.getPosition()
    const size     = win.getSize()
    return {x:position[0], y:position[1], width:size[0], height:size[1]}
  }

  const windowWithinBounds = (windowState,bounds) => windowState.x>=bounds.x && windowState.y>=bounds.y && windowState.x+windowState.width<=bounds.x+bounds.width && windowState.y+windowState.height<=bounds.y+bounds.height

  const resetToDefaults = () => {
    const bounds = screen.getPrimaryDisplay().bounds
    return Object.assign({}, defaultSize, {x:(bounds.width-defaultSize.width)/2, y:(bounds.height-defaultSize.height)/2})
  }

  const ensureVisibleOnSomeDisplay = windowState => (!screen.getAllDisplays().some(display=>windowWithinBounds(windowState,display.bounds))) ? resetToDefaults() : windowState

  const saveState = () => {
    if (!win.isMinimized() && !win.isMaximized()) {Object.assign(state, getCurrentPosition())}
    store.set(key, state)
  }

  state = ensureVisibleOnSomeDisplay(restore())

  win = new BrowserWindow({...options, ...state, webPreferences:{nodeIntegration:true}})

  win.on("close", saveState)

  return win
}
