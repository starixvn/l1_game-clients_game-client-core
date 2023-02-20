const { json } = require("stream/consumers");
const {
  SyncStakeLevelHandler,
} = require("./../dist/players/sync-stake-level-handler");

const testInstace = new SyncStakeLevelHandler();

console.log(JSON.stringify(testInstace));
