const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const isProd = process.env.NODE_ENV === 'production';
const project = process.env.project;
const projectPath = resolve('src', project);
const outputPath = resolve('dist', project);
const publicPath = isProd ? `/your_public/` : `/${project}/`;// 必须是绝对路径. 不可以是 "./" 或者 "../" 开头, 否则css内的 background-image会指向错误
const favicon = resolve(projectPath, 'images/favicon.jpg');
const { entry, htmlPlugins } = resolveEntries();

function resolve(...dir) {
  return path.resolve(__dirname, ...dir);
}

validateUserSettings();
function validateUserSettings(){
  if (/$\./.test(publicPath)) {
    console.error('publicPath 必须为一个绝对路径. 不可以是 "./" 或者 "../" 开头, 否则css内的 background-image会指向错误');
    process.exit(0);
  }
  console.log('如果需要提取reset.less等通用样式, 需要在入口文件显示import, 或者参考: ' + 'https://github.com/webpack-contrib/less-loader/issues/7');
}

module.exports = {
  mode: isProd ? 'production' : 'development',
  devtool: isProd ? 'hidden-source-map' : 'cheap-module-eval-source-map',
  entry: entry,
  output: {
    path: outputPath,
    publicPath,
    filename: isProd ? 'js/[name].[chunkhash:8].js' : 'js/[name].js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          'babel-loader',
          'eslint-loader'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        use: ['vue-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            minimize: isProd,
            removeAttributeQuotes: false,
          }
        }
      },
      {
        test: /.(c|le)ss$/,
        // exclude: /node_modules/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /.(jpg|png|gif|svg|eot|otf|ttf|woff|woff2)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192,
            // 生成位置: `${outputPath}/static/[hash:8].[ext]`
            // 最终引用
            name: isProd ? 'static/[hash:8].[ext]' : 'static/[name].[hash:8].[ext]'
          }
        }
      }
    ]
  },

  plugins: [
    ...htmlPlugins,
    new VueLoaderPlugin()
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        // 多文件拆包, 单文件不拆包(含js|css)
        // ...(htmlPlugins.length > 1
        //   ? {
            vendor: {
              name: 'vendor', // 与 output.filename 一致, 即为 'vendor.[chunckhash:8].js'
              chunks: 'initial',// 如果代码中有异步组件时, 若设置为 'all' 会因找不到模块而报错
              test: /node_modules/,
              enforce: true
            },
          // }
        //   : {}
        // ),
        
        // 提取公用的css, 前提文件名必须是 (reset|common).(le|c|sc|sa)ss, 并且在入口文件中显示 import
        // 或者也许试用如下的方案
        // https://github.com/webpack-contrib/less-loader/issues/7
        common: {
          name: 'vendor',
          chunks: 'all',
          test: /[/\\](reset|common)\.(le|c|sc|sa)ss$/,
          enforce: true
        },
      }
    },
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue', '.less', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.js',
      '@': projectPath,
    }
  },
  performance: {
    hints: isProd ? 'warning' : false // 当打包的文件大于 244 KiB 是会在提出警告
  }
};

if (isProd) {
  module.exports.optimization = {
    ...module.exports.optimization,
    minimize: true,
    minimizer: [
      new OptimizeCSSAssetsPlugin(),// 压缩 css 文件
      new UglifyJsPlugin({
        test: /\.js$/,
        exclude: /\/node_modules/,
        // cache: './dist/.cache',
        parallel: true,
        uglifyOptions: {
          compress: {
            drop_console: true // 去掉所有console.*
          }
        }
      }),
    ]
  };

  module.exports.plugins.push(
    new CleanWebpackPlugin([outputPath]),
    new MiniCssExtractPlugin({
      filename: 'static/[name].[contenthash:8].css',
      chunkFilename: 'static/[id].[contenthash:8].css'
    })
  );
} else {
  module.exports.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
  );

  module.exports.devServer = {
    port: 6600,
    host: '0.0.0.0', // 使用 localhost 或 ip 均可访问
    hot: true, // 热更新 需要配合 webpack.HotModuleReplacementPlugin
    // contentBase: outputPath, // 开发服务运行时的文件根目录
    contentBase: resolve('dist'), // 开发服务运行时的文件根目录

    overlay: true,// 出错时浏览器 DOM 上展示错误信息
    noInfo: true,
    watchContentBase: true,// 当 html 文件发生变化时, 也可以触发浏览器刷新了
    after: devServerAfter,
    // useLocalIp: true, open: true, // 当 open: true 时, 将使用本地 ip 自动打开地址
    // historyApiFallback: true, // 如果访问的路由页面或接口为404时, 总返回index.html(单页面应用)
    // historyApiFallback: {
    //   rewrites: [
    //     { from: /./, to: path.resolve(__dirname, './dist/mobile/index.html')}
    //   ]
    // },
    // compress: true, // 开发服务器是否启动gzip等压缩
    // before(app){},
    // proxy: {
    //   '/api': {
    //     target: 'http://www.example.com',
    //     changeOrigin: true,
    //     pathRewrite: {
    //       '/api': ''
    //     },
    //   }
    // }
  };
}

function devServerAfter() {
  console.log(chalk.bgGreen.bold('√ Build success!\n'));
  console.log('webpack-dev-server:');
  console.log(chalk.green(`
[Info] Mode       : ${process.env.NODE_ENV}
[Info] Project    : ${projectPath}
[Info] Output     : ${module.exports.output.path}
[Info] Server     : ${this.contentBase}
[Info] PublicPath : ${this.publicPath}
[Info] Visit      : http://localhost:${this.port + this.publicPath}
                  : http://${getIP()}:${this.port + this.publicPath}`
  ));
}

// 获取人口文件和对应的html
function resolveEntries() {
  const jsDir = resolve(projectPath, 'js');
  const htmlDir = resolve(projectPath, 'views');
  const entry = {};
  const htmlPlugins = [];

  fs.readdirSync(jsDir).forEach(file => {
    const filename = file.match(/(.+)\.jsx?$/)[1];
    const htmlname = `${filename}.html`;
    const html = resolve(htmlDir, htmlname);

    entry[filename] = [
      resolve(jsDir, file),
      ...(isProd ? [] : [html])// 让修改 html 自动刷新
    ];

    htmlPlugins.push(
      new HtmlWebpackPlugin({
        template: resolve(htmlDir, htmlname),
        filename: htmlname,
        favicon: favicon,
        chunks: ['vendor', filename],
      })
    );
  });

  return {
    entry,
    htmlPlugins
  };
}

function getIP() {
  const OS = require('os');
  const interfaces = OS.networkInterfaces();

  for (let devName in interfaces) {
    const iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
}