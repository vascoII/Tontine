"use client";

// REACT
import { useState, useEffect, useRef } from "react";

// CONTRACT
import { contractAddressTontineSep, abiTontineSep } from "@/constants";

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
export const getSilverVaultDataService = async () => {
  try {
    const ethLocked = await readContract({
      address: contractAddressTontineSep,
      abi: abiTontineSep,
      functionName: "silverVaultBalance",
    });

    const silverVaultExchangeRate = await readContract({
      address: contractAddressTontineSep,
      abi: abiTontineSep,
      functionName: "getSilverVaultExchangeRate",
    });

    const apr = Number(silverVaultExchangeRate) / 100;

    const activeUsers = await readContract({
      address: contractAddressTontineSep,
      abi: abiTontineSep,
      functionName: "findSilverVaultUserCount",
    });

    const interestGenerated = await readContract({
      address: contractAddressTontineSep,
      abi: abiTontineSep,
      functionName: "silverVaultInteretBalance",
    });
    return { ethLocked, apr, activeUsers, interestGenerated };
  } catch (err) {
    console.error(err.message);
    throw err; // Relancer l'erreur pour la gestion dans le composant
  }
};

//GoldVaultDataService
export const getGoldVaultDataService = async () => {
  try {
    const ethLocked = await readContract({
      address: contractAddressTontineSep,
      abi: abiTontineSep,
      functionName: "goldVaultBalance",
    });

    const goldVaultExchangeRate = await readContract({
      address: contractAddressTontineSep,
      abi: abiTontineSep,
      functionName: "getGoldVaultExchangeRate",
    });
    const apr = Number(goldVaultExchangeRate) / 100;

    const activeUsers = await readContract({
      address: contractAddressTontineSep,
      abi: abiTontineSep,
      functionName: "findGoldVaultUserCount",
    });
    const interestGenerated = await readContract({
      address: contractAddressTontineSep,
      abi: abiTontineSep,
      functionName: "goldVaultInteretBalance",
    });
    return { ethLocked, apr, activeUsers, interestGenerated };
  } catch (err) {
    console.error(err.message);
    throw err; // Relancer l'erreur pour la gestion dans le composant
  }
};
