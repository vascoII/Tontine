"use client";

// REACT
import { useState, useEffect } from "react";

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

/*********** SETTERS *************/
// mintMonthly
export const mintMonthlyService = async (contractAddressTine, abiTine) => {
  try {
    const { request } = await prepareWriteContract({
      address: contractAddressTine,
      abi: abiTine,
      functionName: "mintMonthly",
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

//SetSmartContractMaxBalance
export const setSmartContractMaxBalanceService = async (
  _maxBalance,
  contractAddressTine,
  abiTine
) => {
  try {
    const { request } = await prepareWriteContract({
      address: contractAddressTine,
      abi: abiTine,
      functionName: "setMaxBalance",
      args: [_maxBalance],
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

//setMinLockTime
export const setSmartContracMinLockTimeService = async (
  _minLockTime,
  contractAddressTine,
  abiTine
) => {
  try {
    const { request } = await prepareWriteContract({
      address: contractAddressTine,
      abi: abiTine,
      functionName: "setMinLockTime",
      args: [_minLockTime],
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

//setMinLockAmount
export const setSmartContracMinLockAmountService = async (
  _minLockAmount,
  contractAddressTine,
  abiTine
) => {
  try {
    const { request } = await prepareWriteContract({
      address: contractAddressTine,
      abi: abiTine,
      functionName: "setMinLockAmount",
      args: [_minLockAmount],
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

//withdrawEthService
export const withdrawEthService = async (
  _smartContractWithdrawEth,
  _address,
  contractAddressTine,
  abiTine
) => {
  try {
    const { request } = await prepareWriteContract({
      address: contractAddressTine,
      abi: abiTine,
      functionName: "withdrawEth",
      args: [_smartContractWithdrawEth * 10 * 18, _address],
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
