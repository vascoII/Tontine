"use client";

// REACT
import { useState, useEffect } from "react";

// CONTRACT
import { contractAddressTineSep, abiTineSep } from "@/constants";

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
export const mintMonthlyService = async () => {
  try {
    const { request } = await prepareWriteContract({
      address: contractAddressTineSep,
      abi: abiTineSep,
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
export const setSmartContractMaxBalanceService = async (_maxBalance) => {
  try {
    const { request } = await prepareWriteContract({
      address: contractAddressTineSep,
      abi: abiTineSep,
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
export const setSmartContracMinLockTimeService = async (_minLockTime) => {
  try {
    const { request } = await prepareWriteContract({
      address: contractAddressTineSep,
      abi: abiTineSep,
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
export const setSmartContracMinLockAmountService = async (_minLockAmount) => {
  try {
    const { request } = await prepareWriteContract({
      address: contractAddressTineSep,
      abi: abiTineSep,
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
  _address
) => {
  try {
    const { request } = await prepareWriteContract({
      address: contractAddressTineSep,
      abi: abiTineSep,
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
