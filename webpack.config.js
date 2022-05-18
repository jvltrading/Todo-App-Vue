const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require("vue-loader");

//datahub imports
const Datahub = require('macaca-datahub');
const datahubMiddleware = require('datahub-proxy-middleware');
const datahubConfig = {
    port: 5050,
    hostname: '127.0.0.1',
    store: path.join(__dirname, '..', 'data'),
    proxy: {
        '/api': {
            hub: 'sample',
        }
    },
    showBoard: true,
};
const defaultDatahub = new Datahub({
    port: datahubConfig.port,
});

// module
module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
    path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        onAfterSetupMiddleware: () => {
            defaultDatahub.startServer(datahubConfig).then(() => {
              console.log('datahub ready');
            });
        },
        static: { directory: path.join(__dirname, 'dist') },
        port: 8080,
        open: true,
    },
    module: {
        rules: [
            { test: /\.css$/, use: 
                [ 
                    'style-loader',
                    'css-loader'
                ]
            },
            { test: /\.vue$/i, exclude: /(node_modules)/, use: 'vue-loader'},
            { test: /\.(js|jsx)$/, exclude: /(node_modules)/, use: { loader: 'babel-loader', options: { presets: ['@babel/preset-env'] } } },
            { test: /\.html$/i, loader: 'html-loader' },
            // { test: /\.css$/i, use: [ MiniCssExtractPlugin.loader, 'css-loader' ] }
        ],
    },
    plugins: [
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
          template: 'index.html'
        }),
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                styles: {
                    name: 'styles',
                    type: 'css/mini-extract',
                    chunks: 'all',
                    enforce: true,
                },
            },
        },
    }
};