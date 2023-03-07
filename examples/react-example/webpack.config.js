/*eslint-env node*/

const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = env => {
    return {
        entry: './src/index.tsx',
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'build')
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.json']
        },
        mode: 'development',
        devtool: 'inline-source-map',
        devServer: {
            port: 3000,
            historyApiFallback: true,
            compress: true,
            allowedHosts: 'all'
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader'
                },
                {
                    test: /\.ttf$/,
                    type: 'asset/resource'
                }
            ]
        },
        plugins: [
            new CopyPlugin({
                patterns: [{ from: 'src/templates' }]
            })
        ]
    };
};
