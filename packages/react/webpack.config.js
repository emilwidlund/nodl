/*eslint-env node*/
const path = require('path');

module.exports = env => {
    return {
        entry: './src/index.ts',
        output: {
            filename: 'index.js',
            path: path.resolve(__dirname, 'build'),
            libraryTarget: 'umd',
            globalObject: 'this'
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.json'],
            fallback: {
                stream: false,
                buffer: false
            }
        },
        mode: 'development',
        externals: {
            react: 'commonjs react',
            'react-dom': 'commonjs react-dom'
        },
        target: 'node',
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader'
                }
            ]
        }
    };
};
