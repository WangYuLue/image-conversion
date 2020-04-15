const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.ts",
  output: {
    filename: "conversion.js",
    path: path.resolve(__dirname, "build"),
    library: 'imageConversion',
    globalObject: "this",
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  devServer: {
    port: 3000
  },
  resolve: {
    extensions: [".ts", ".js", ".d.ts"],
    alias: {
      "@models": path.resolve(__dirname, "src/models/"),
      "@utils": path.resolve(__dirname, "src/utils/"),
    }
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: { comments: false }
        }
      })
    ]
  },
  plugins: [
    // 兼容低版本浏览器
    new webpack.ProvidePlugin({
      'Promise': 'es6-promise',
      'fetch': ['whatwg-fetch', 'fetch']
    })
  ]
};