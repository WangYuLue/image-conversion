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
};