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
import { createPublicClient, http, parseAbiItem } from "viem";
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

// getPublicVaultData
export const getPublicVaultData = async () => {
  try {
    /**const ownerAddress = await readContract({
      address: contractAddress,
      abi: abi,
      functionName: "owner",
    });
    return ownerAddress === userAddress;*/
    return [];
  } catch (err) {
    console.error(err.message);
    throw err; // Relancer l'erreur pour la gestion dans le composant
  }
};

// getPrivateVaultData
export const getPrivateVaultData = async (userAddress) => {
  try {
    /**const ownerAddress = await readContract({
      address: contractAddress,
      abi: abi,
      functionName: "owner",
    });
    return ownerAddress === userAddress;*/
    return [];
  } catch (err) {
    console.error(err.message);
    throw err; // Relancer l'erreur pour la gestion dans le composant
  }
};
