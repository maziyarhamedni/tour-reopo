const path = require('path');  

module.exports = {  
    entry: './src/login.ts', // Adjust the entry point according to your file structure  
    output: {  
        filename: 'bundle.js',  
        path: path.resolve(__dirname, 'dist'),  
    },  
    resolve: {  
        extensions: ['.ts', '.js'],  
    },  
    module: {  
        rules: [  
            {  
                test: /\.ts$/,  
                use: 'ts-loader',  
                exclude: /node_modules/,  
            },  
        ],  
    },  
    mode: 'development', // Change to 'production' for minified builds  
};  