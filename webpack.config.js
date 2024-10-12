const path = require('path');
module.exports = {
    optimization: {
        minimize: false,
      },
    target: "node",
    mode: 'production',//development、production   这里是说webpack打包的结果是哪种，选production会进行极致压缩获得低存储大小同时使代码失去可读性
    entry: {
        app: path.resolve(__dirname, "./src/main.js"),
    },
    output: {
        path: path.resolve(__dirname, './learner'),  //出口路径
        filename: "src/app.js",
    },
    module: {
        rules: [
            {
                test: /\.ttf/, // 匹配各种字体文件
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name].ttf' // 指定打包后文件存放的文件夹和文件名
                }
            },
        ]
    }
};