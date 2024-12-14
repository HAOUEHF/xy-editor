import { Config } from '@stencil/core'
import { sass } from '@stencil/sass'
import alias from '@rollup/plugin-alias'
import path from 'path'
import { postcss } from '@stencil-community/postcss'
import autoprefixer from 'autoprefixer'
import tailwindcss from 'tailwindcss' // 添加 Tailwind CSS

export const config: Config = {
  namespace: 'xy-editor',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader'
    },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
      externalRuntime: false
    },
    {
      type: 'docs-readme'
    },
    {
      type: 'www',
      serviceWorker: null // disable service workers
    }
  ],
  testing: {
    browserHeadless: 'new'
  },
  plugins: [
    sass({
      injectGlobalPaths: ['src/common/styles/var.scss', 'src/common/styles/common.scss']
    }),
    postcss({
      plugins: [autoprefixer(), tailwindcss()]
    })
  ],
  rollupPlugins: {
    after: [
      alias({
        entries: [{ find: '@', replacement: path.resolve(__dirname, 'src') }]
      })
    ]
  }
}
