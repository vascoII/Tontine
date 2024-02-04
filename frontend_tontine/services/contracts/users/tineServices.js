"use client";

// REACT
import { useState, useEffect } from "react";

// CONTRACT
import { contractAddressTine, abiTine } from "@/constants";

// WAGMI
import {
  prepareWriteContract,
  writeContract,
  waitForTransaction,
  readContract,
  getPublicClient,
} from "@wagmi/core";

import { useAccount } from "wagmi";

// VIEM (pour les events)
import {
  createPublicClient,
  http,
  parseAbiItem,
  parseEther,
  parseUnits,
} from "viem";
import { hardhat } from "viem/chains";

// Créer un client `viem`
const client = createPublicClient({
  chain: hardhat,
  transport: http(),
});

/************* GETTERS  ***********************/
//SmartContractTokenBalance
export const getSmartContractTokenBalanceService = async () => {
  try {
    const smartContractTokenBalance = await readContract({
      address: contractAddressTine,
      abi: abiTine,
      functionName: "getSmartContractTokenBalance",
    });
    return smartContractTokenBalance;
  } catch (err) {
    throw err; // Relancer l'erreur pour la gestion dans le composant
  }
};

//SmartContractEthBalance
export const getSmartContractEthBalanceService = async () => {
  try {
    const smartContractEthBalance = await readContract({
      address: contractAddressTine,
      abi: abiTine,
      functionName: "getSmartContractEthBalance",
    });
    return smartContractEthBalance;
  } catch (err) {
    throw err; // Relancer l'erreur pour la gestion dans le composant
  }
};

//SmartContractMaxSupply
export const getSmartContractMaxSupplyService = async () => {
  try {
    const smartContractMaxSupply = await readContract({
      address: contractAddressTine,
      abi: abiTine,
      functionName: "MAX_SUPPLY",
    });
    return smartContractMaxSupply;
  } catch (err) {
    throw err; // Relancer l'erreur pour la gestion dans le composant
  }
};

//SmartContractMaxBalance
export const getSmartContractMaxBalanceService = async () => {
  try {
    const smartContractMaxBalance = await readContract({
      address: contractAddressTine,
      abi: abiTine,
      functionName: "MAX_BALANCE",
    });
    return smartContractMaxBalance;
  } catch (err) {
    throw err; // Relancer l'erreur pour la gestion dans le composant
  }
};

//SmartContractCurrentSupply
export const getSmartContractCurrentSupplyService = async () => {
  try {
    const smartContractCurrentSupply = await readContract({
      address: contractAddressTine,
      abi: abiTine,
      functionName: "totalSupply",
    });
    return smartContractCurrentSupply;
  } catch (err) {
    throw err; // Relancer l'erreur pour la gestion dans le composant
  }
};

//SmartContractCurrentLockTime
export const getSmartContractMinLockTimeService = async () => {
  try {
    const smartContractCurrentLockTime = await readContract({
      address: contractAddressTine,
      abi: abiTine,
      functionName: "MIN_LOCK_TIME",
    });
    return smartContractCurrentLockTime;
  } catch (err) {
    throw err; // Relancer l'erreur pour la gestion dans le composant
  }
};

//SmartContractCurrentLockAmount
export const getSmartContractMinLockAmountService = async () => {
  try {
    const smartContractCurrentLockAmount = await readContract({
      address: contractAddressTine,
      abi: abiTine,
      functionName: "MIN_LOCK_AMOUNT",
    });
    return smartContractCurrentLockAmount;
  } catch (err) {
    throw err; // Relancer l'erreur pour la gestion dans le composant
  }
};

// Approve
export const approveService = async (_tineAmount) => {
  try {
    const tineAmountInWei = parseUnits(_tineAmount, 18);
    const { request } = await prepareWriteContract({
      address: contractAddressTine,
      abi: abiTine,
      functionName: "approve",
      args: [contractAddressTine, tineAmountInWei],
    });
    const { hash } = await writeContract(request);
    await waitForTransaction({
      hash: hash,
    });
    // Gérer la réponse de la transaction ici si nécessaire
    return true;
  } catch (err) {
    throw err;
  }
};

// Contract getTineLocked
export const getTineLockedDateService = async (userAddress) => {
  try {
    const tineLockedDate = await readContract({
      address: contractAddressTine,
      abi: abiTine,
      functionName: "tineLocked",
      args: [userAddress],
    });
    return tineLockedDate;
  } catch (err) {
    console.error(err.message);
    throw err; // Relancer l'erreur pour la gestion dans le composant
  }
};

// Contract getUserTineBalance
export const getUserTineBalanceService = async (userAddress) => {
  try {
    const tineBalance = await readContract({
      address: contractAddressTine,
      abi: abiTine,
      functionName: "balanceOf",
      args: [userAddress],
    });
    return tineBalance;
  } catch (err) {
    throw err; // Relancer l'erreur pour la gestion dans le composant
  }
};

/*************** SETTERS  ****************************/
// buyTine
export const buyTineService = async (_tineAmount) => {
  try {
    const { request } = await prepareWriteContract({
      address: contractAddressTine,
      abi: abiTine,
      functionName: "buyTine",
      args: [_tineAmount],
      value: parseEther(_tineAmount.toString()),
    });
    const { hash } = await writeContract(request);
    await waitForTransaction({
      hash: hash,
    });
    // Gérer la réponse de la transaction ici si nécessaire
    return true;
  } catch (err) {
    throw err;
  }
};

// lockTine
export const lockTineService = async () => {
  try {
    const { request } = await prepareWriteContract({
      address: contractAddressTine,
      abi: abiTine,
      functionName: "lockTine",
      args: [],
    });
    const { hash } = await writeContract(request);
    await waitForTransaction({
      hash: hash,
    });
    // Gérer la réponse de la transaction ici si nécessaire
    return true;
  } catch (err) {
    throw err;
  }
};

// unLock
export const unlockTineService = async () => {
  try {
    const { request } = await prepareWriteContract({
      address: contractAddressTine,
      abi: abiTine,
      functionName: "unlockTine",
      args: [],
    });
    const { hash } = await writeContract(request);
    await waitForTransaction({
      hash: hash,
    });
    // Gérer la réponse de la transaction ici si nécessaire
    return true;
  } catch (err) {
    alert(err.message);
    throw err;
  }
};

// sellTine
export const sellTineService = async (_tineAmount) => {
  try {
    const approveSucess = await approveService(_tineAmount);
    const { request } = await prepareWriteContract({
      address: contractAddressTine,
      abi: abiTine,
      functionName: "sellTine",
      args: [_tineAmount],
    });
    const { hash } = await writeContract(request);
    await waitForTransaction({
      hash: hash,
    });
    // Gérer la réponse de la transaction ici si nécessaire
    return true;
  } catch (err) {
    throw err;
  }
};
