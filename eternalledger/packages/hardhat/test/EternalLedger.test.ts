import { expect } from "chai";
import { ethers } from "hardhat";
import { EternalLedger } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("EternalLedger – Lifecycle Registry", function () {
  /* ----------  fixtures  ---------- */
  let ledger: EternalLedger;
  let owner: SignerWithAddress;
  let registrar: SignerWithAddress;
  let alice: SignerWithAddress;   // a living person
  let bob: SignerWithAddress;     // another living person

  /* ----------  const  ---------- */
  const NRIC_ALICE = "S1234567A";
  const NRIC_BOB   = "S7654321B";
  const CID        = "QmTest123";

  /* ----------  before each  ---------- */
  beforeEach(async () => {
    [owner, registrar, alice, bob] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("EternalLedger");
    ledger = (await Factory.deploy()) as unknown as EternalLedger;
    await ledger.waitForDeployment();

    // authorize the second signer as a registrar
    await ledger.authorizeRegistrar(registrar.address);
  });

  /* ----------  identity binding  ---------- */
  describe("bindIdentity", () => {
    it("registrar can bind an NRIC to a wallet", async () => {
      await expect(ledger.connect(registrar).bindIdentity(NRIC_ALICE, alice.address))
        .to.emit(ledger, "IdentityBound")
        .withArgs(NRIC_ALICE, alice.address);

      expect(await ledger.nricToWallet(NRIC_ALICE)).to.equal(alice.address);
      expect(await ledger.walletToNric(alice.address)).to.equal(NRIC_ALICE);
    });

    it("reverts if NRIC already bound", async () => {
      await ledger.connect(registrar).bindIdentity(NRIC_ALICE, alice.address);
      await expect(
        ledger.connect(registrar).bindIdentity(NRIC_ALICE, bob.address)
      ).to.be.revertedWith("NRIC already bound");
    });

    it("reverts if wallet already bound", async () => {
      await ledger.connect(registrar).bindIdentity(NRIC_ALICE, alice.address);
      await expect(
        ledger.connect(registrar).bindIdentity(NRIC_BOB, alice.address)
      ).to.be.revertedWith("Wallet already bound");
    });

    it("reverts for non-registrar", async () => {
      await expect(
        ledger.connect(alice).bindIdentity(NRIC_ALICE, alice.address)
      ).to.be.revertedWith("Not authorized registrar");
    });
  });

  /* ----------  death recording  ---------- */
  describe("recordDeath", () => {
    beforeEach(async () => {
      await ledger.connect(registrar).bindIdentity(NRIC_ALICE, alice.address);
    });

    it("registrar can record death & mint SBT", async () => {
      await expect(ledger.connect(registrar).recordDeath(NRIC_ALICE, CID))
        .to.emit(ledger, "DeathRecorded")
        .withArgs(NRIC_ALICE, 1, CID);

      expect(await ledger.totalSupply()).to.equal(1);
      expect(await ledger.ownerOf(1)).to.equal(alice.address);
      expect(await ledger.isDeceased(NRIC_ALICE)).to.be.true;
    });

    it("reverts if NRIC not registered", async () => {
      await expect(
        ledger.connect(registrar).recordDeath("S9999999Z", CID)
      ).to.be.revertedWith("NRIC not registered");
    });

    it("reverts if already deceased", async () => {
      await ledger.connect(registrar).recordDeath(NRIC_ALICE, CID);
      await expect(
        ledger.connect(registrar).recordDeath(NRIC_ALICE, CID)
      ).to.be.revertedWith("Already deceased");
    });

    it("reverts if called by non-registrar", async () => {
      await expect(
        ledger.connect(alice).recordDeath(NRIC_ALICE, CID)
      ).to.be.revertedWith("Not authorized registrar");
    });
  });

  /* ----------  soulbound behaviour  ---------- */
  describe("Soulbound token", () => {
    beforeEach(async () => {
      await ledger.connect(registrar).bindIdentity(NRIC_ALICE, alice.address);
      await ledger.connect(registrar).recordDeath(NRIC_ALICE, CID);
    });

    it("cannot transfer", async () => {
      await expect(
        ledger.connect(alice).transferFrom(alice.address, bob.address, 1)
      ).to.be.revertedWith("Soulbound: non-transferable");
    });

    it("cannot approve", async () => {
      await expect(
        ledger.connect(alice).approve(bob.address, 1)
      ).to.be.revertedWith("Soulbound: non-transferable");
    });

    it("locked() returns true", async () => {
      expect(await ledger.locked(1)).to.be.true;
    });
  });

  /* ----------  registry views  ---------- */
  describe("Views", () => {
    it("getTokenByNric returns correct tokenId", async () => {
      await ledger.connect(registrar).bindIdentity(NRIC_ALICE, alice.address);
      expect(await ledger.getTokenByNric(NRIC_ALICE)).to.equal(0); // not dead yet

      await ledger.connect(registrar).recordDeath(NRIC_ALICE, CID);
      expect(await ledger.getTokenByNric(NRIC_ALICE)).to.equal(1);
    });

    it("getAllDeceased returns arrays of length totalSupply", async () => {
      await ledger.connect(registrar).bindIdentity(NRIC_ALICE, alice.address);
      await ledger.connect(registrar).bindIdentity(NRIC_BOB, bob.address);

      await ledger.connect(registrar).recordDeath(NRIC_ALICE, CID);
      const [ids, recs] = await ledger.getAllDeceased();
      expect(ids.length).to.equal(1);
      expect(recs.length).to.equal(1);
      expect(recs[0].metadataCID).to.equal(CID);
    });
  });

  /* ----------  owner functions  ---------- */
  describe("Owner", () => {
    it("owner can authorize/revoke registrar", async () => {
      await expect(ledger.authorizeRegistrar(bob.address))
        .to.emit(ledger, "RegistrarAuthorized")
        .withArgs(bob.address);

      await expect(ledger.revokeRegistrar(bob.address))
        .to.emit(ledger, "RegistrarRevoked")
        .withArgs(bob.address);
    });

    it("non-owner cannot authorize", async () => {
      await expect(
        ledger.connect(alice).authorizeRegistrar(bob.address)
      ).to.be.revertedWithCustomError(ledger, "OwnableUnauthorizedAccount");
    });
  });
});