# Game Client Base

- Implement the game client base to not depend on any Javascript game engine.
- Testable, includes unittest and integration test.

## How to run and develop this project

1. Run the npm script "dev:game-service" to host the game service simulation.
2. Run the npm script "dev:game-client" to see the game client console demo that uses the game client round base.
3. You can go to http://locahost:3000 to run the game client HTML. Please be noted that the game client HTML is built from the npm script "build". Every time you change the code related to "./tests/integration-tests/game-client/startup.ts" you should run the build command
