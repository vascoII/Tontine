import {
  getSilverVaultDepositsByUser,
  getSilverVaultWithdrawsByUser,
  getSilverVaultInterestByUser,
  getGoldVaultDepositsByUser,
  getGoldVaultWithdrawsByUser,
  getGoldVaultInterestByUser,
} from "@/services/contracts/users/tontineServices";

import { toBigIntSafe } from "@/services/utils/numberUtils";

export const fetchUserSilverVaultData = async (
  userAddress,
  setSilverBalance,
  setSilverVaultOperation,
  setSilverInterest,
  toast
) => {
  try {
    const userSilverDeposits = await getSilverVaultDepositsByUser(userAddress);
    const userSilverWithdraws = await getSilverVaultWithdrawsByUser(
      userAddress
    );
    const userSilverInterest = await getSilverVaultInterestByUser(userAddress);
    // Fusionner les dépôts et les retraits en ajoutant une indication de la nature de chaque transaction
    const allSilverTransactions = [];
    let balance = 0n;
    let transactionId = 0; // Initialisez un compteur pour les identifiants de transaction

    userSilverDeposits.forEach((deposit) => {
      allSilverTransactions.push({
        key: `deposit-${transactionId++}`, // Utilisez et incrémentez le compteur pour la clé
        date: deposit.timeDeposited,
        deposits: deposit.amount,
        withdraws: null, // Il s'agit d'un dépôt, donc le montant de retrait est de 0
      });
      // Calcul du solde
      balance += toBigIntSafe(deposit.amount);
    });
    userSilverWithdraws.forEach((withdraw) => {
      allSilverTransactions.push({
        key: `withdraw-${transactionId++}`, // Utilisez et incrémentez le compteur pour la clé
        date: withdraw.timeWithdrawed,
        deposits: null, // Il s'agit d'un retrait, donc le montant de dépôt est de 0
        withdraws: withdraw.amount,
      });
      // Calcul du solde
      balance -= toBigIntSafe(withdraw.amount);
    });
    // Triez la liste par date
    const sortedSilverTransactions = allSilverTransactions.sort(
      (a, b) => Number(a.date) - Number(b.date)
    );
    //Set Balance
    setSilverBalance(balance);
    //Set operations
    setSilverVaultOperation(sortedSilverTransactions);
    //Set Interest
    setSilverInterest(userSilverInterest);
  } catch (err) {
    toast({
      title: "Error!",
      description: "An error occured on fetching silver vault operation.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  }
};

export const fetchUserGoldVaultData = async (
  userAddress,
  setGoldBalance,
  setGoldVaultOperation,
  setGoldInterest,
  toast
) => {
  try {
    const userGoldDeposits = await getGoldVaultDepositsByUser(userAddress);
    const userGoldWithdraws = await getGoldVaultWithdrawsByUser(userAddress);
    const userGoldInterest = await getGoldVaultInterestByUser(userAddress);

    // Fusionner les dépôts et les retraits en ajoutant une indication de la nature de chaque transaction
    const allGoldTransactions = [];
    let balance = 0n;
    let transactionId = 0; // Initialisez un compteur pour les identifiants de transaction

    userGoldDeposits.forEach((deposit) => {
      allGoldTransactions.push({
        key: `deposit-${transactionId++}`, // Utilisez et incrémentez le compteur pour la clé
        date: deposit.timeDeposited,
        deposits: deposit.amount,
        withdraws: null, // Il s'agit d'un dépôt, donc le montant de retrait est de 0
      });
      // Calcul du solde
      balance += toBigIntSafe(deposit.amount);
    });
    userGoldWithdraws.forEach((withdraw) => {
      allGoldTransactions.push({
        key: `withdraw-${transactionId++}`, // Utilisez et incrémentez le compteur pour la clé
        date: withdraw.timeWithdrawed,
        deposits: null, // Il s'agit d'un retrait, donc le montant de dépôt est de 0
        withdraws: withdraw.amount,
      });
      // Calcul du solde
      balance -= toBigIntSafe(withdraw.amount);
    });
    // Triez la liste par date
    const sortedGoldTransactions = allGoldTransactions.sort(
      (a, b) => Number(a.date) - Number(b.date)
    );
    //Set Balance
    setGoldBalance(balance);
    //Set operations
    setGoldVaultOperation(sortedGoldTransactions);
    //Set Interest
    setGoldInterest(userGoldInterest);
  } catch (err) {
    toast({
      title: "Error!",
      description: "An error occured on fetching gold vault operation.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  }
};
