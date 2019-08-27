/******************************************************************************/
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
const withCss = require("@zeit/next-css")

module.exports = withCss({
  webpack: (config,{isServer}) => {
    config.target = "electron-renderer"
    config.module.rules.push({
      test: /\.worker\.js$/,
      loader: "worker-loader",
      options: {
        name: "static/[hash].worker.js",
        publicPath: "/_next/"
      }
    })
    if (isServer) {
      const antStyles     = /antd\/.*?\/style\/css.*?/
      const origExternals = [...config.externals]
      config.externals    = [
        (context,request,callback)=>{
          if (request.match(antStyles)) {
            return callback()
          }
          if (typeof origExternals[0]==="function") {
            origExternals[0](context,request,callback)
          } else {
            callback()
          }
        },
        ...(typeof origExternals[0]==="function" ? [] : origExternals)
      ]
      config.module.rules.unshift({
        test: antStyles,
        use: "null-loader"
      })
    }
    config.output.globalObject = `(typeof self!=="undefined" ? self : this)`
    return config
  }
})
