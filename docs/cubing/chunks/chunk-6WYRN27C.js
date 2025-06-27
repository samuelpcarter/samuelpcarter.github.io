import {
  node_adapter_default
} from "./chunk-RDSQRW3G.js";

// src/cubing/vendor/apache/comlink-everywhere/inside/index.ts
import { expose as comlinkExpose } from "comlink";
var useNodeWorkarounds = typeof globalThis.Worker === "undefined" && typeof globalThis.WorkerNavigator === "undefined";
async function nodeEndpointPort() {
  const { parentPort } = globalThis.process.getBuiltinModule(
    "node:worker_threads"
  );
  return node_adapter_default(
    parentPort
  );
}
function expose(api) {
  if (useNodeWorkarounds) {
    (async () => {
      comlinkExpose(api, await nodeEndpointPort());
    })();
  } else {
    comlinkExpose(api);
  }
}

export {
  nodeEndpointPort,
  expose
};
//# sourceMappingURL=chunk-6WYRN27C.js.map
