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
// Approve
export const approveService = async (_tineAmountInWei) => {
  try {
    const { request } = await prepareWriteContract({
      address: contractAddressTine,
      abi: abiTine,
      functionName: "approve",
      args: [contractAddressTine, _tineAmountInWei],
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
export const buyTineService = async (_tineAmount, ethCost) => {
  try {
    const tineAmountInWei = parseUnits(String(_tineAmount), 18);
    const { request } = await prepareWriteContract({
      address: contractAddressTine,
      abi: abiTine,
      functionName: "buyTine",
      args: [tineAmountInWei],
      value: parseEther(ethCost),
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
    throw err;
  }
};

// sellTine
export const sellTineService = async (_tineAmount) => {
  try {
    const tineAmountInWei = parseUnits(String(_tineAmount), 18);
    const approveSucess = await approveService(tineAmountInWei);
    const { request } = await prepareWriteContract({
      address: contractAddressTine,
      abi: abiTine,
      functionName: "sellTine",
      args: [tineAmountInWei],
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
