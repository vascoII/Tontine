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
export const fetchTokenBalanceService = async () => {
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
export const fetchEthBalanceService = async () => {
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
export const fetchMaxSupplyService = async () => {
  try {
    const smartContractMaxSupply = await readContract({
      address: contractAddressTine,
      abi: abiTine,
      functionName: "maxSupply",
    });
    return smartContractMaxSupply;
  } catch (err) {
    throw err; // Relancer l'erreur pour la gestion dans le composant
  }
};

//SmartContractMaxBalance
export const fetchMaxBalanceService = async () => {
  try {
    const smartContractMaxBalance = await readContract({
      address: contractAddressTine,
      abi: abiTine,
      functionName: "maxBalance",
    });
    return smartContractMaxBalance;
  } catch (err) {
    throw err; // Relancer l'erreur pour la gestion dans le composant
  }
};

//SmartContractCurrentSupply
export const fetchCurrentSupplyService = async () => {
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
export const fetchMinLockTimeService = async () => {
  try {
    const smartContractCurrentLockTime = await readContract({
      address: contractAddressTine,
      abi: abiTine,
      functionName: "minLockTime",
    });
    return smartContractCurrentLockTime;
  } catch (err) {
    throw err; // Relancer l'erreur pour la gestion dans le composant
  }
};

//SmartContractCurrentLockAmount
export const fetchMinLockAmountService = async () => {
  try {
    const smartContractCurrentLockAmount = await readContract({
      address: contractAddressTine,
      abi: abiTine,
      functionName: "minLockAmount",
    });
    return smartContractCurrentLockAmount;
  } catch (err) {
    throw err; // Relancer l'erreur pour la gestion dans le composant
  }
};
