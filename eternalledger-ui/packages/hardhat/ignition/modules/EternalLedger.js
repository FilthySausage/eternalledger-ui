// const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

// module.exports = buildModule("EternalLedgerModule", (m) => {
//   const eternalLedger = m.contract("EternalLedger");

//   return { eternalLedger };
// });

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("EternalLedgerModule", (m) => {
  const eternalLedger = m.contract("EternalLedger");
  return { eternalLedger };
});