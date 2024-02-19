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

// Contract Owner
export const getOwner = async (
  userAddress,
  contractAddressTontine,
  abiTontine
) => {
  try {
    const ownerAddress = await readContract({
      address: contractAddressTontine,
      abi: abiTontine,
      functionName: "owner",
    });
    return ownerAddress === userAddress;
  } catch (err) {
    throw err; // Relancer l'erreur pour la gestion dans le composant
  }
};
