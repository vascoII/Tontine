"use client";

// REACT
import { useState, useEffect, useRef } from "react";

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

//SilverVaultDataService
export const getSilverVaultDataService = async (
  contractAddressTontine,
  abiTontine
) => {
  try {
    const ethLocked = await readContract({
      address: contractAddressTontine,
      abi: abiTontine,
      functionName: "silverVaultBalance",
    });

    const silverVaultExchangeRate = await readContract({
      address: contractAddressTontine,
      abi: abiTontine,
      functionName: "getSilverVaultExchangeRate",
    });

    const apr = Number(silverVaultExchangeRate) / 100;

    const activeUsers = await readContract({
      address: contractAddressTontine,
      abi: abiTontine,
      functionName: "findSilverVaultUserCount",
    });

    const interestGenerated = await readContract({
      address: contractAddressTontine,
      abi: abiTontine,
      functionName: "silverVaultInteretBalance",
    });
    return { ethLocked, apr, activeUsers, interestGenerated };
  } catch (err) {
    throw err; // Relancer l'erreur pour la gestion dans le composant
  }
};

//GoldVaultDataService
export const getGoldVaultDataService = async (
  contractAddressTontine,
  abiTontine
) => {
  try {
    const ethLocked = await readContract({
      address: contractAddressTontine,
      abi: abiTontine,
      functionName: "goldVaultBalance",
    });

    const goldVaultExchangeRate = await readContract({
      address: contractAddressTontine,
      abi: abiTontine,
      functionName: "getGoldVaultExchangeRate",
    });
    const apr = Number(goldVaultExchangeRate) / 100;

    const activeUsers = await readContract({
      address: contractAddressTontine,
      abi: abiTontine,
      functionName: "findGoldVaultUserCount",
    });
    const interestGenerated = await readContract({
      address: contractAddressTontine,
      abi: abiTontine,
      functionName: "goldVaultInteretBalance",
    });
    return { ethLocked, apr, activeUsers, interestGenerated };
  } catch (err) {
    throw err; // Relancer l'erreur pour la gestion dans le composant
  }
};
