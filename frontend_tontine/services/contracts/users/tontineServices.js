"use client";

// REACT
import { useState, useEffect, useRef } from "react";

// CONTRACT
import { contractAddressTontine, abiTontine } from "@/constants";

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
import { createPublicClient, http, parseAbiItem, parseEther } from "viem";
import { hardhat } from "viem/chains";

// Créer un client `viem`
const client = createPublicClient({
  chain: hardhat,
  transport: http(),
});

// Contract getUserByAddress
export const isAlreadyUser = async (userAddress) => {
  try {
    const isUserExists = await readContract({
      address: contractAddressTontine,
      abi: abiTontine,
      functionName: "isAlreadyUser",
      args: [userAddress],
    });
    return isUserExists;
  } catch (err) {
    console.error(err.message);
    throw err; // Relancer l'erreur pour la gestion dans le composant
  }
};

// Contract SilverVaultDepositsByUser
export const getSilverVaultDepositsByUser = async (userAddress) => {
  try {
    const silverVaultDeposits = await readContract({
      address: contractAddressTontine,
      abi: abiTontine,
      functionName: "getSilverVaultDepositsForUser",
      args: [userAddress],
    });
    return silverVaultDeposits;
  } catch (err) {
    console.error(err.message);
    throw err; // Relancer l'erreur pour la gestion dans le composant
  }
};

// Contract SilverVaultWithdrawsByUser
export const getSilverVaultWithdrawsByUser = async (userAddress) => {
  try {
    const silverVaultWithdraws = await readContract({
      address: contractAddressTontine,
      abi: abiTontine,
      functionName: "getSilverVaultWithdrawsForUser",
      args: [userAddress],
    });
    return silverVaultWithdraws;
  } catch (err) {
    console.error(err.message);
    throw err; // Relancer l'erreur pour la gestion dans le composant
  }
};

// Contract GoldVaultDepositsByUser
export const getGoldVaultDepositsByUser = async (userAddress) => {
  try {
    const goldVaultDeposits = await readContract({
      address: contractAddressTontine,
      abi: abiTontine,
      functionName: "getGoldVaultDepositsForUser",
      args: [userAddress],
    });
    return goldVaultDeposits;
  } catch (err) {
    console.error(err.message);
    throw err; // Relancer l'erreur pour la gestion dans le composant
  }
};

// Contract GoldVaultWithdrawsByUser
export const getGoldVaultWithdrawsByUser = async (userAddress) => {
  try {
    const goldVaultWithdraws = await readContract({
      address: contractAddressTontine,
      abi: abiTontine,
      functionName: "getGoldVaultWithdrawsForUser",
      args: [userAddress],
    });
    return goldVaultWithdraws;
  } catch (err) {
    console.error(err.message);
    throw err; // Relancer l'erreur pour la gestion dans le composant
  }
};

/*************** SETTERS  ****************************/
// stakeOnSilverService
export const stakeOnSilverService = async (_ethSilverAmount) => {
  try {
    const { request } = await prepareWriteContract({
      address: contractAddressTontine,
      abi: abiTontine,
      functionName: "depositEth",
      args: [false],
      value: parseEther(String(_ethSilverAmount)),
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

// stakeOnGoldService
export const stakeOnGoldService = async (_ethGoldAmount) => {
  try {
    const { request } = await prepareWriteContract({
      address: contractAddressTontine,
      abi: abiTontine,
      functionName: "depositEth",
      args: [true],
      value: parseEther(String(_ethGoldAmount)),
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

// stakeOnSilverService
export const unstakeOnSilverService = async (_ethSilverAmount) => {
  try {
    const { request } = await prepareWriteContract({
      address: contractAddressTontine,
      abi: abiTontine,
      functionName: "withdrawEth",
      args: [false, parseEther(String(_ethSilverAmount))],
    });
    const { hash } = await writeContract(request);
    await waitForTransaction({
      hash: hash,
    });
    // Gérer la réponse de la transaction ici si nécessaire
    return true;
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};

// stakeOnGoldService
export const unstakeOnGoldService = async (_ethGoldAmount) => {
  try {
    const { request } = await prepareWriteContract({
      address: contractAddressTontine,
      abi: abiTontine,
      functionName: "withdrawEth",
      args: [true, parseEther(String(_ethGoldAmount))],
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
