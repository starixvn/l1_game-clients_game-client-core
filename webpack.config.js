const packageJson = require("./package.json");

const packageName = packageJson.name;
const libraryName = packageName
  .split("-")
  .map((part) => part[0].toUpperCase() + part.substring(1))
  .join("");

module.exports = {
  entry: "./src/index.ts",
  output: {
    filename: `${packageName}.js`,
    library: libraryName,
    libraryTarget: "umd",
  },
  mode: "production",
  resolve: {
    extensions: [".ts", ".js"],
  },
  node: false,
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: "ts-loader",
      },
    ],
  },
};
