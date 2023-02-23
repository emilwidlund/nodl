/*eslint-env node*/

const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = env => {
    return {
        entry: './src/index.ts',
        output: {
            filename: 'index.js',
            path: path.resolve(__dirname, 'build'),
            libraryTarget: 'umd'
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.json']
        },
        mode: 'development',
        externals: {
            react: 'commonjs react',
            'react-dom': 'commonjs react-dom'
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
                patterns: [{ from: 'src/assets', to: 'assets' }]
            })
        ]
    };
};
