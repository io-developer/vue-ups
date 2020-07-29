const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    entry: './public/main.js',
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'public')
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader",
                options: {
                    hotReload: true,
                },
            },
            {
                test: /\.(css)$/,
                use: ["vue-style-loader", "css-loader"]
            },
            {
                test: /\.svg$/,
                loader: 'file-loader',
                query: {
                    name: 'assets/[name].[hash:8].[ext]'
                }
                /*
                loader: 'vue-svg-loader',
                        options: {
                            // Optional svgo options
                            svgo: {
                                plugins: [{ removeViewBox: true }]
                            }
                        }
                */
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                options: {
                    presets: [
                        '@babel/preset-env',
                        {
                            'plugins': [
                                '@babel/plugin-proposal-class-properties'
                            ]
                        }
                    ]
                }
            }
        ]
    },
    resolve: {
        alias: {
            vue$: "vue/dist/vue.esm.js"
        },
        extensions: ["*", ".js", ".vue", ".json"]
    },
    plugins: [new VueLoaderPlugin()],
};