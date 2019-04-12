
/* 将tsconfig的路径配置映射到webpack中，这样就不需要在webpack中配置alias */
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const LessPluginAutoPrefix = require('less-plugin-autoprefix');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HappyPack = require('happypack')
const args = require('node-args');
/* antd组件的按需打包，打包后有错误，暂时不用 */
const tsImportPluginFactory = require('ts-import-plugin')
const happyThreadPool = HappyPack.ThreadPool({ size: 4 });
const resolve = require('./resolve')
const theme = require('./theme');

const path = require('path');
const port = 8887;
const isProduction = args.mode === 'production';

module.exports = {
    mode: 'development',
    entry: {
        app: path.join(__dirname, './src/index'),
    },
    output: {
        path: `${__dirname}/dist`,
        publicPath: '/',
        filename: '[name].[chunkhash:8]js'
    },
    devtool: 'source-map',
    module: {
        rules: [{
            test: /\.(jsx|tsx|js|ts)$/,
            exclude: /node_modules/,
            use: [{
                loader: 'awesome-typescript-loader',
                //loader: 'happypack/loader?id=js'
                options: {
                    /* 启用缓存，第一次编译时间会变长，但是之后的编译会变短 */
                    //useCache: true,
                    // cacheDirectory: resolve('.cache-loader'),
                    // getCustomTransformers: () => ({
                    //     before: [tsImportPluginFactory({
                    //         libraryName: 'antd',
                    //         libraryDirectory: 'lib',
                    //         style: true
                    //     })]
                    // }),
                }
            }]
        }, {
            test: /\.(le|c)ss$/,
            use: [
                MiniCssExtractPlugin.loader,
                'happypack/loader?id=style'
            ]
        }, {
            test: /\.(png|gif|jpg|svg)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    name: 'assets/[hash:6].[ext]',
                    fallback: 'file-loader'
                }
            }]
        }, {
            test: /\.(ttf|eot|otf|woff(2)?)(\?[\s\S]+)?$/,
            use: [{
                loader: 'file-loader',
            }]
        }]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '.less'],
        plugins: [
            new TsconfigPathsPlugin({
                configFile: 'tsconfig.json'
            })
        ]
    },
    plugins: (function(){
        let plugins = [
            new HappyPack({
                id: 'style',
                threadPool: happyThreadPool,
                loaders: [
                    'css-loader',
                    {
                        loader: 'less-loader',
                        options: {
                            strictMath: false,
                            javascriptEnabled: true,
                            //modifyVars: theme,
                            plugins: [
                                new LessPluginAutoPrefix()
                            ]
                        }
                    }
                ],
                verbose: true
            }),
            // new HappyPack({
            //     id: 'js',
            //     threadPool: happyThreadPool,
            //     //loaders: ['awesome-typescript-loader']
            // }),
            new HtmlWebpackPlugin({
                title: 'demo',
                filename: 'index.html',
                template: 'build/template.ejs',
                favicon: 'build/favicon.ico',
                banner: {
                    date: new Date().toLocaleString(),
                },
                minify: {
                    removeComments: true,
                    collapseWhitespace: false,
                    removeAttributeQuotes: true
                }
            }),
            new MiniCssExtractPlugin({
                filename: "[name].css",
                chunkFilename: '[name].[contenthash:8].css'
            }),
            new BundleAnalyzerPlugin(),
          
        ];
        if(isProduction){
            plugins.push(new CleanWebpackPlugin())
        }
        return plugins;
    })(),
    optimization: {
        runtimeChunk: {
            name: 'minifest'
        },
        splitChunks: {
            cacheGroups: {
                libs: {
                    name: 'libs',
                    chunks: 'all',
                    priority: 9,
                    minChunks: 1,
                    test: /babel-polyfill|\/react\/|react-dom|react-router-dom|mobx|lodash|jquery/,
                },
            }
        }
    },
    devServer: {
        host: '0.0.0.0',
        port: port,
        useLocalIp: true,
        disableHostCheck: true,
        compress: true,
        open: true,
        inline: true,
        progress: true,
        overlay: {
            warnings: true,
            errors: true
        },
        historyApiFallback: true,
    }
}