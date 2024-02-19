// CONTRACT
import {
  contractAddressTineHardhat,
  abiTineHardhat,
  contractAddressTontineHardhat,
  abiTontineHardhat,
  contractAddressTineSep,
  abiTineSep,
  contractAddressTontineSep,
  abiTontineSep,
  contractAddressTineMumbai,
  abiTineMumbai,
  contractAddressTontineMumbai,
  abiTontineMumbai,
} from "@/constants";

export const getContractInfo = (networkChainId) => {
  switch (networkChainId) {
    case 11155111: // Sepolia
      return {
        contractAddressTine: contractAddressTineSep,
        abiTine: abiTineSep,
        contractAddressTontine: contractAddressTontineSep,
        abiTontine: abiTontineSep,
      };
    case 80001: // Mumbai
      return {
        contractAddressTine: contractAddressTineMumbai,
        abiTine: abiTineMumbai,
        contractAddressTontine: contractAddressTontineMumbai,
        abiTontine: abiTontineMumbai,
      };
    default:
      // Retournez hardhat
      return {
        contractAddressTine: contractAddressTineHardhat,
        abiTine: abiTineHardhat,
        contractAddressTontine: contractAddressTontineHardhat,
        abiTontine: abiTontineHardhat,
      };
  }
};
