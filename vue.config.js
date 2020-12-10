// vue.config.js
const path = require('path')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const CompressionPlugin = require('compression-webpack-plugin')// 引入gzip压缩插件

function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {

  publicPath: './',

  // 生产环境关闭 source map
  productionSourceMap: false,
  
  // 是否使用包含运行时编译器的 Vue 构建版本。设置为 true 后你就可以在 Vue 组件中使用 template 选项了，但是这会让你的应用额外增加 10kb 左右。
  runtimeCompiler: false,

  // lintOnSave: true,

  // 配置css
  css: {
    loaderOptions: {
        postcss: {
            plugins: [
                require('postcss-plugin-px2rem')({
                    rootValue: 41.4, //换算基数， 默认100  ，这样的话把根标签的字体规定为1rem为50px,这样就可以从设计稿上量出多少个px直接在代码中写多上px了。
                    // unitPrecision: 5, //允许REM单位增长到的十进制数字。
                    //propWhiteList: [],  //默认值是一个空数组，这意味着禁用白名单并启用所有属性。
                    // propBlackList: [], //黑名单
                    exclude: /(node_module)/,  //默认false，可以（reg）利用正则表达式排除某些文件夹的方法，例如/(node_module)/ 。如果想把前端UI框架内的px也转换成rem，请把此属性设为默认值
                    // selectorBlackList: [], //要忽略并保留为px的选择器
                    // ignoreIdentifier: false,  //（boolean/string）忽略单个属性的方法，启用ignoreidentifier后，replace将自动设置为true。
                    // replace: true, // （布尔值）替换包含REM的规则，而不是添加回退。
                    mediaQuery: false,  //（布尔值）允许在媒体查询中转换px。
                    minPixelValue: 3 //设置要替换的最小像素值(3px会被转rem)。 默认 0
                }),
            ]
        }
    }
  },
  // 是一个函数，会接收一个基于 webpack-chain 的 ChainableConfig 实例。允许对内部的 webpack 配置进行更细粒度的修改。
  chainWebpack: config => {
    // 配置别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('views', resolve('src/views'))

    config.optimization.minimizer('terser').tap((args) => {
      // 去除生产环境console
      args[0].terserOptions.compress.drop_console = true
      return args
    })
  },

  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(new BundleAnalyzerPlugin())

      config.plugins.push(new CompressionPlugin({ // gzip压缩配置
        test: /\.js$|\.html$|\.css/, // 匹配文件名
        threshold: 10240, // 对超过10kb的数据进行压缩
        deleteOriginalAssets: false // 是否删除原文件
      }))
    }
  },

  // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
  parallel: require('os').cpus().length > 1,
  lintOnSave: false
}