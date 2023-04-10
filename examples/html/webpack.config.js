const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const name = "client";

module.exports = {
  mode: "development",
  name: name,
  node: false,
  devtool: "source-map",
  entry: "./src/startup.ts",
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: "ts-loader",
      },
    ],
  },
  output: {
    filename: `${name}.min.js`,
    path: path.resolve(__dirname, "public/js"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "public", "index.html"),
    }),
  ],
  devServer: {
    port: 3001,
    historyApiFallback: true,
  },
};
