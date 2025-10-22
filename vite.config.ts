import { defineConfig, RollupCommonJSOptions, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import optimizePersist from 'vite-plugin-optimize-persist'
import packageConfig from 'vite-plugin-package-config'
import vitePluginImport from 'vite-plugin-import'
import themePreprocessorPlugin from '@zougt/vite-plugin-theme-preprocessor'
import path from 'path'
import fs from 'fs'

const resolve = (dir: string) => path.join(__dirname, dir)

// const getComps = async (
//   dir: string,
//   arr: Array<{
//     compName: string
//     compPath: string
//   }> = []
// ) => {
//   const files = await fs.promises.readdir(dir)

//   for (const fileName of files) {
//     if (/.vue$/.test(fileName)) {
//       const compName = fileName.replace(/.vue/, '')
//       const compPath = dir
//         .replace(__dirname, '@')
//         .replace(/\\/g, '/')
//         .replace('/src', '') +
//         `/${fileName}`

//       arr.push({ compName, compPath })
//     }

//     // 查找子文件夹
//     const fileDir = path.join(dir, fileName)
//     const stat = await fs.promises.stat(fileDir)
//     if (stat.isDirectory()) await getComps(fileDir, arr)
//   }

//   return arr
// }
// (async () => {
//   // 获取所有全局组件
//   const comps = await getComps(resolve('src/components'), [])

//   let str = ''
//   comps.forEach((v, i) => {
//     str += `${v.compName}: typeof import('${v.compPath}')['default']`
//     if (i !== comps.length - 1) str += '\n    '
//   })

//   const code =
//     `/**
//  * automatic generate global components declaration
//  * @see vite.config.ts
//  */

// declare module 'vue' {
//   export interface GlobalComponents {
//     ${str}
//   }
// }

// export { }
// `

//   fs.promises.writeFile('src/types/components.d.ts', code, 'utf-8')
// })()

// https://cn.vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    optimizeDeps: {
      exclude: ['@zougt/vite-plugin-theme-preprocessor/dist/browser-utils']
    },

    plugins: [
      vue(),
      // optimizePersist(),
      // packageConfig(),
      // vitePluginImport({
      //   onlyBuild: false,
      //   babelImportPluginOptions: [
      //     {
      //       libraryName: 'ant-design-vue',
      //       libraryDirectory: 'es',
      //       style: true
      //     }
      //   ]
      // }),
      // https://github.com/GitOfZGT/vite-plugin-theme-preprocessor
      // themePreprocessorPlugin({
      //   less: {
      //     arbitraryMode: false,
      //     multipleScopeVars: [
      //       {
      //         scopeName: 'theme-default',
      //         path: resolve('src/assets/scss/theme-default.scss')
      //       }
      //     ],
      //     extract: false
      //   }
      // })
    ],

    // css: {
    //   preprocessorOptions: {
    //     less: {
    //       javascriptEnabled: true,
    //       modifyVars: {
    //         '@ant-prefix': 'dana'
    //       }
    //     },
    //     scss: {
    //       additionalData: '@import "@/assets/scss/variable.scss";'
    //     }
    //   }
    // },

    resolve: {
      alias: {
        '@': resolve('src')
      }
    },

    server: {
      // host: '10.30.22.228',
      port: 3000,
      open: true,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          // target: 'http://43.138.147.106:1123',
          changeOrigin: true
        },
        '/ws': {
          // target: 'ws://43.138.147.106:1123',
          target: env.VITE_WS_BASE_URL,
          ws: true,
          changeOrigin: true,
          rewrite: (path) => path,
          configure: (proxy, options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('WebSocket proxy error:', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('WebSocket proxy request:', req.url);
            });
            proxy.on('open', (proxySocket) => {
              console.log('WebSocket proxy connected');
            });
            proxy.on('close', (res, socket, head) => {
              console.log('WebSocket proxy disconnected');
            });
          }
        }
      }
    },

    // build: {
    //   commonjsOptions: <RollupCommonJSOptions>{
    //     ignoreTryCatch: false
    //   }
    // }
  }
})
