const { expect } = require("chai");
const hre = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("Token contract", function () {
  let Token;
  let token;
  let tineSmartContractAddress;
  let owner;
  let buyer;
  let user;
  let buyAmount = 10;
  let ethRate = 1;
  let ethToSend = 10;
  let MIN_LOCK_TIME = 60;
  let MIN_LOCK_AMOUNT = 1;
  let MAX_SUPPLY = 21_000;
  let MAX_BALANCE = 100;

  beforeEach(async function () {
    Token = await ethers.getContractFactory("Tine");
    token = await Token.deploy("0x5FbDB2315678afecb367f032d93F642f64180aa3");
    [owner, buyer, user] = await ethers.getSigners();
    tineSmartContractAddress = await token.getAddress();
    // Configuration simplifiée pour les tests
    buyAmount = hre.ethers.parseUnits("10", 18); // 10 TINE
    ethToSend = hre.ethers.parseEther("10"); // Supposant 1 TINE = 1 ETH
    excessEth = hre.ethers.parseEther("1"); // 1 ETH supplémentaire
    buyAmountExceed = hre.ethers.parseUnits("1000", 18); // 1000 TINE
    ethToSendExceed = hre.ethers.parseEther("1000");
    buyAmountExceedBis = hre.ethers.parseUnits("5000", 18); // 1000 TINE
    ethToSendExceedBis = hre.ethers.parseEther("5000");

    lockAmount = hre.ethers.parseUnits("1", 18);

    sellAmount = hre.ethers.parseUnits("10", 18); // Vendre 10 TINE
    ethAmount = sellAmount;
    sellAmountExceed = hre.ethers.parseUnits("100", 18);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await token.owner()).to.equal(owner.address);
    });
    it("Should set the MIN_LOCK_TIME", async function () {
      const minLockTime = await token.MIN_LOCK_TIME();
      expect(Number(minLockTime)).to.equal(MIN_LOCK_TIME);
    });
    it("Should set the MIN_LOCK_AMOUNT", async function () {
      const minLockAmount = await token.MIN_LOCK_AMOUNT();
      expect(Number(hre.ethers.formatEther(minLockAmount))).to.equal(
        MIN_LOCK_AMOUNT
      );
    });
    it("Should set the MAX_SUPPLY", async function () {
      const maxSupply = await token.MAX_SUPPLY();
      expect(Number(hre.ethers.formatEther(maxSupply))).to.equal(MAX_SUPPLY);
    });
    it("Should set the MAX_BALANCE", async function () {
      const maxBalance = await token.MAX_BALANCE();
      expect(Number(hre.ethers.formatEther(maxBalance))).to.equal(MAX_BALANCE);
    });
    it("Should mint the right amount to owner", async function () {
      const ownerBalanceOf = await token.balanceOf(owner.address);
      expect(Number(hre.ethers.formatEther(ownerBalanceOf))).to.equal(1000);
    });
    it("Should mint the right amount to contract", async function () {
      const tokenBalanceOf = await token.balanceOf(token);
      expect(Number(hre.ethers.formatEther(tokenBalanceOf))).to.equal(1000);
    });
  });

  describe("MintMonthly", function () {
    it("Should not allow the owner to mint more than once a month", async function () {
      await expect(token.mintMonthly()).to.be.revertedWith(
        "Error_mintMonthly_not_allowed"
      );
    });

    it("Should not mint if the MAX_SUPPLY is exceeded", async function () {
      await token.connect(owner).setMaxSupply(0);
      await time.increase(2592000);
      await expect(token.mintMonthly()).to.be.revertedWith(
        "Error_mintMonthly_supply_exceeded"
      );
    });

    it("Should mint tokens to the owner", async function () {
      const initialSupply = await token.totalSupply();
      const initialOwnerBalance = await token.balanceOf(owner.address);
      await time.increase(2592000);
      await token.mintMonthly();

      const finalSupply = await token.totalSupply();
      const finalOwnerBalance = await token.balanceOf(owner.address);

      expect(finalSupply - initialSupply).to.equal(
        hre.ethers.parseUnits("100", 18)
      ); // Assurez-vous que cela correspond au montant minté
      expect(finalOwnerBalance - initialOwnerBalance).to.equal(
        hre.ethers.parseUnits("100", 18)
      ); // Le propriétaire devrait recevoir les tokens
    });
  });

  describe("BuyTine", function () {
    it("Should fail when TINE amount is 0", async function () {
      await expect(
        token.connect(buyer).buyTine(0, { value: ethToSend })
      ).to.be.revertedWith("Error_buyTine_amount_0");
    });

    it("Should fail when ETH sent does not match TINE price", async function () {
      const incorrectEthToSend = hre.ethers.parseEther("9"); // Moins que nécessaire
      await expect(
        token.connect(buyer).buyTine(buyAmount, { value: incorrectEthToSend })
      ).to.be.reverted;
    });

    it("Should fail if adding ETH exceeds MAX_BALANCE", async function () {
      await expect(
        token
          .connect(buyer)
          .buyTine(buyAmountExceed, { value: ethToSendExceed })
      ).to.be.reverted;
    });

    it("Should fail if the contract does not have enough TINE to sell", async function () {
      await expect(
        token
          .connect(buyer)
          .buyTine(buyAmountExceedBis, { value: ethToSendExceedBis })
      ).to.be.reverted;
    });
  });

  describe("LockTine", function () {
    it("Should allow users to lock TINE with sufficient balance", async function () {
      await expect(token.connect(owner).lockTine())
        .to.emit(token, "LockTineEvent")
        .withArgs(owner.address);

      const lockedTime = await token.tineLocked(owner.address);
      expect(lockedTime).to.be.gt(0);
    });

    it("Should fail to lock TINE with insufficient balance", async function () {
      // On tente de verrouiller sans avoir de TINE
      await expect(token.connect(buyer).lockTine()).to.be.revertedWith(
        "Error_lockTine_insufficient_TINE_to_lock"
      );
    });

    it("Should fail to lock TINE if TINE is already locked", async function () {
      // Première tentative de verrouillage réussie
      await token.connect(owner).lockTine();

      // Deuxième tentative échoue car les TINE sont déjà verrouillés
      await expect(token.connect(owner).lockTine()).to.be.revertedWith(
        "Error_lockTine_TINE_already_locked"
      );
    });
  });

  describe("UnockTine", function () {
    beforeEach(async function () {
      token.connect(owner).lockTine();
    });

    it("Should allow users to unlock TINE after MIN_LOCK_TIME", async function () {
      // Avancer le temps pour simuler l'écoulement de MIN_LOCK_TIME
      await time.increase(2592000);

      await expect(token.connect(owner).unlockTine())
        .to.emit(token, "UnlockTineEvent")
        .withArgs(owner.address);

      const lockedTime = await token.tineLocked(owner.address);
      expect(lockedTime).to.equal(0); // Assurez-vous que le verrouillage est bien levé
    });

    it("Should fail to unlock TINE with no TINE locked", async function () {
      await time.increase(2592000);
      // Assurez-vous qu'aucun TINE n'est verrouillé pour cet utilisateur
      await token.connect(owner).unlockTine(); // Supposons que cette première tentative de déverrouillage soit réussie

      // Essayer de déverrouiller à nouveau sans avoir de TINE verrouillés
      await expect(token.connect(owner).unlockTine()).to.be.revertedWith(
        "Error_unlockTine_no_TINE_locked"
      );
    });

    it("Should fail to unlock TINE before MIN_LOCK_TIME has elapsed", async function () {
      // Tente de déverrouiller immédiatement après verrouillage, sans avancer le temps
      await expect(token.connect(owner).unlockTine()).to.be.revertedWith(
        "Error_unlockTine_not_over_yet"
      );
    });
  });

  describe("SellTine", function () {
    it("Should fail if the TINE amount is 0", async function () {
      await expect(token.connect(owner).sellTine(0)).to.be.revertedWith(
        "Error_sellTine_amount_0"
      );
    });

    it("Should fail if the token allowance is insufficient", async function () {
      // L'utilisateur n'autorise pas suffisamment de TINE
      await token.connect(buyer).approve(tineSmartContractAddress, 0);

      await expect(
        token.connect(buyer).sellTine(sellAmount)
      ).to.be.revertedWith("Error_checkAllowance");
    });

    it("Should fail if the contract does not have enough ETH", async function () {
      // Configurez le scénario pour que le contrat n'ait pas suffisamment d'ETH
      // Peut-être en envoyant de l'ETH du contrat vers le propriétaire ou un autre compte

      await token
        .connect(owner)
        .approve(tineSmartContractAddress, sellAmountExceed);

      await expect(token.connect(owner).sellTine(sellAmountExceed)).to.be
        .reverted;
    });

    it("Should fail if the contract does not have enough allowance", async function () {
      await expect(
        token.connect(buyer).sellTine(sellAmountExceed)
      ).to.be.revertedWith("Error_checkAllowance");
    });
  });

  describe("OwnerModifiyParams", function () {
    it("Should allow the owner to successfully change MIN_LOCK_TIME", async function () {
      const newMinLockTime = 120; // Supposons que vous changiez le temps de verrouillage minimum à 120 secondes

      await expect(token.connect(owner).setMinLockTime(newMinLockTime)).to.not
        .be.reverted;

      expect(await token.MIN_LOCK_TIME()).to.equal(newMinLockTime);
    });

    it("Should fail to change MIN_LOCK_TIME by a non-owner", async function () {
      const newMinLockTime = 120;

      await expect(token.connect(buyer).setMinLockTime(newMinLockTime)).to.be
        .reverted; // Utilisez le message d'erreur approprié selon votre implémentation Ownable
    });

    it("Should fail to set MIN_LOCK_TIME to 0", async function () {
      await expect(token.connect(owner).setMinLockTime(0)).to.be.revertedWith(
        "Error_setMinLockTime_Lock_time_must_be_greater_than_0"
      );
    });

    it("Should allow the owner to successfully change MIN_LOCK_AMOUNT", async function () {
      const newMinLockAmount = hre.ethers.parseUnits("100", 18);

      await expect(token.connect(owner).setMinLockAmount(newMinLockAmount)).to
        .not.be.reverted;

      const minAmountLock = await token.MIN_LOCK_AMOUNT();
      const newMinLockAmountNumber = Number(newMinLockAmount) * 10 ** 18;
      expect(Number(minAmountLock)).to.equal(newMinLockAmountNumber);
    });

    it("Should fail to change MIN_LOCK_AMOUNT by a non-owner", async function () {
      const newMinLockAmount = hre.ethers.parseUnits("100", 18); // Valeur arbitraire pour le test

      await expect(token.connect(buyer).setMinLockAmount(newMinLockAmount)).to
        .be.reverted; // Assurez-vous que le message d'erreur correspond à votre implémentation
    });

    it("Should fail to set MIN_LOCK_AMOUNT to 0", async function () {
      const zeroAmount = 0; // Tentative de mise à jour à 0

      await expect(
        token.connect(owner).setMinLockAmount(zeroAmount)
      ).to.be.revertedWith(
        "Error_setMinLockAmount_amount_must_be_greater_than_0"
      );
    });

    it("Should allow the owner to successfully change MAX_SUPPLY", async function () {
      const newMaxSupply = hre.ethers.parseUnits("5000000", 18); // Exemple de nouveau MAX_SUPPLY

      await expect(token.connect(owner).setMaxSupply(newMaxSupply)).to.not.be
        .reverted;

      const maxSupply = Number(await token.MAX_SUPPLY()) / 10 ** 18;
      const newMinLockAmountNumber = Number(newMaxSupply);
      expect(maxSupply).to.equal(newMinLockAmountNumber);
    });

    it("Should fail to change MAX_SUPPLY by a non-owner", async function () {
      const newMaxSupply = hre.ethers.parseUnits("5000000", 18); // Valeur arbitraire pour le test

      await expect(token.connect(buyer).setMaxSupply(newMaxSupply)).to.be
        .reverted; // Assurez-vous que le message d'erreur correspond à votre implémentation
    });

    it("Should allow the owner to successfully change MAX_BALANCE", async function () {
      const newMaxBalance = hre.ethers.parseUnits("50", 18); // Exemple de nouveau MAX_BALANCE

      await expect(token.connect(owner).setMaxBalance(newMaxBalance)).to.not.be
        .reverted;

      const maxBalance = Number(await token.MAX_BALANCE()) / 10 ** 18;
      const newMaxBalanceNumber = Number(newMaxBalance);
      expect(maxBalance).to.equal(newMaxBalanceNumber);
    });

    it("Should fail to change MAX_BALANCE by a non-owner", async function () {
      const newMaxBalance = hre.ethers.parseUnits("50", 18); // Valeur arbitraire pour le test

      await expect(token.connect(buyer).setMaxBalance(newMaxBalance)).to.be
        .reverted; // Assurez-vous que le message d'erreur correspond à votre implémentation
    });
  });

  describe("WithdrawEth", function () {});

  describe("ManageErrors", function () {});
});
