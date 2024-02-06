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

//AnnualInterestRateTontine
export const getAnnualInterestRateService = async () => {
  try {
    const annualInterestRateTontine = await readContract({
      address: contractAddressTontine,
      abi: abiTontine,
      functionName: "annualInterestRateTontine",
    });
    return annualInterestRateTontine;
  } catch (err) {
    console.error(err.message);
    throw err; // Relancer l'erreur pour la gestion dans le composant
  }
};

//SilverVaultDataService
export const getSilverVaultDataService = async () => {
  try {
    const ethLocked = await readContract({
      address: contractAddressTontine,
      abi: abiTontine,
      functionName: "silverVaultBalance",
    });

    const annualInterestRateTontine = await getAnnualInterestRateService();
    const apr = Number(annualInterestRateTontine);

    const activeUsers = await readContract({
      address: contractAddressTontine,
      abi: abiTontine,
      functionName: "findSilverVaultUserCount",
    });
    return { ethLocked, apr, activeUsers };
  } catch (err) {
    console.error(err.message);
    throw err; // Relancer l'erreur pour la gestion dans le composant
  }
};

//GoldVaultDataService
export const getGoldVaultDataService = async () => {
  try {
    const ethLocked = await readContract({
      address: contractAddressTontine,
      abi: abiTontine,
      functionName: "goldVaultBalance",
    });

    const annualInterestRateTontine = await getAnnualInterestRateService();
    const goldVaultMultiplier = await readContract({
      address: contractAddressTontine,
      abi: abiTontine,
      functionName: "GOLD_VAULT_MULTIPLIER",
    });
    const apr =
      (Number(annualInterestRateTontine) * Number(goldVaultMultiplier)) / 100;

    const activeUsers = await readContract({
      address: contractAddressTontine,
      abi: abiTontine,
      functionName: "findGoldVaultUserCount",
    });
    return { ethLocked, apr, activeUsers };
  } catch (err) {
    console.error(err.message);
    throw err; // Relancer l'erreur pour la gestion dans le composant
  }
};
