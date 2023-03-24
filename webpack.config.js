const packageJson = require("./package.json");
const path = require("path");
const packageName = packageJson.name;
const libraryName = packageName
  .split("-")
  .map((part) => part[0].toUpperCase() + part.substring(1))
  .join("");

const common = {
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

const gameBaseModule = Object.assign({}, common, {
  name: "game-client-base",
  entry: "./src/index.ts",
  output: {
    filename: `${packageName}.js`,
    library: libraryName,
    libraryTarget: "umd",
  },
});

const gameClientTestModule = Object.assign({}, common, {
  name: "game-client-test",
  entry: "./tests/integration-tests/game-client/startup.ts",
  output: {
    filename: "game-client-test.min.js",
    path: path.resolve(__dirname, "public/js"),
  },
});

module.exports = [gameBaseModule, gameClientTestModule];
