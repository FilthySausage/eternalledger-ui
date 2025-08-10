import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("SeedEternalLedger", (m) => {
  const { eternalLedger } = m.useModule("EternalLedgerModule");

  // Mock hospital addresses (Hardhat accounts #4-#6)
  const hosp1 = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";
  const hosp2 = "0x90F79bf6EB2c4f870365E785982E1f101E93b906";
  const hosp3 = "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65";

  // Authorize registrars
  m.call(eternalLedger, "authorizeRegistrar", [hosp1]);
  m.call(eternalLedger, "authorizeRegistrar", [hosp2]);
  m.call(eternalLedger, "authorizeRegistrar", [hosp3]);

  // Bind identities (NRIC → wallet)
  const nrics = ["S1111111A", "S2222222B", "S3333333C", "S4444444D", "S5555555E"];
  const wallets = [
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc"
  ];
  nrics.forEach((nric, i) =>
    m.call(eternalLedger, "bindIdentity", [nric, wallets[i]], { from: hosp1 })
  );

  // Record 3 deaths with pre-uploaded IPFS CIDs
  const ipfsCids = [
    "bafkreiexample111",
    "bafkreiexample222",
    "bafkreiexample333"
  ];
  ["S1111111A", "S2222222B", "S3333333C"].forEach((nric, i) =>
    m.call(
      eternalLedger,
      "recordDeath",
      [nric, ipfsCids[i]],
      { from: hosp2 }
    )
  );

  return { eternalLedger };
});