const path = require("path");

module.exports = {
  mode: "production",
  entry: "./test/unit/index.test.ts",
  output: {
    filename: "index.test.js",
    path: path.resolve(__dirname, "unit/"),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  }
};