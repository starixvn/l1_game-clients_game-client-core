# Game Client Base

-   Implement the game client base to not depend on any Javascript game engine.
-   Testable, includes unittest and integration test.

## How to run and develop this project

### 1. Install dependencies

```shell
npm install
```

### 2. Build library

```shell
npm run build
```

### 3. Install all example packages

```shell
npm install --prefix examples/cocos-3x
npm install --prefix examples/html
npm install --prefix examples/server-simulator
npm run install-sedie-dependency --prefix examples/server-simulator
```

### 4. Start `service simulator`, it is running at: http://localhost:3000

```shell
npm start --prefix examples/server-simulator
```

### 5. Start `webpack server`, it is running at: http://localhost:3001

```shell
npm start --prefix examples/html
```

### 6. Start `tsc` with watch mode

```shell
npm start
```
