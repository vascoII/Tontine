import {
  stakeOnSilverService,
  stakeOnGoldService,
  unstakeOnSilverService,
  unstakeOnGoldService,
} from "@/services/contracts/users/tontineServices";

/** SILVER */
export const handleStakeOnSilverVault = async (
  ethSilverAmount,
  fetchVaultData,
  onSilverClose,
  toast,
  setIsLoading,
  contractAddressTontine,
  abiTontine
) => {
  try {
    setIsLoading(true);
    const success = await stakeOnSilverService(
      ethSilverAmount,
      contractAddressTontine,
      abiTontine
    );
    setIsLoading(false);
    if (success) {
      fetchVaultData();
      onSilverClose();
      toast({
        title: "Congratulations!",
        description: `You have successfully stake Eth on Silver Vault`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Error!",
        description:
          "An error occured while trying to stake Eth on Silver Vault.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  } catch (err) {
    setIsLoading(false);
    if (err.message.includes("User rejected the request")) {
      toast({
        title: "Transaction Rejected",
        description: "You rejected the request.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Error!",
        description: "An error occured.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }
};

/** GOLD */
export const handleStakeOnGoldVault = async (
  ethGoldAmount,
  fetchVaultData,
  onGoldClose,
  toast,
  setIsLoading,
  contractAddressTontine,
  abiTontine
) => {
  try {
    setIsLoading(true);
    const success = await stakeOnGoldService(
      ethGoldAmount,
      contractAddressTontine,
      abiTontine
    );
    setIsLoading(false);
    if (success) {
      fetchVaultData();
      onGoldClose();
      toast({
        title: "Congratulations!",
        description: `You have successfully stake Eth on Gold Vault`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Error!",
        description:
          "An error occured while trying to stake Eth on Gold Vault.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  } catch (err) {
    setIsLoading(false);
    if (err.message.includes("User rejected the request")) {
      toast({
        title: "Transaction Rejected",
        description: "You rejected the request.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Error!",
        description: "An error occured.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }
};

/** SILVER */
export const handleUnstakeOnSilverVault = async (
  ethSilverAmount,
  toast,
  onSilverClose,
  setIsLoading,
  fetchUserSilverVaultData,
  userAddress,
  setSilverBalance,
  setSilverVaultOperation,
  setSilverInterest,
  contractAddressTontine,
  abiTontine
) => {
  try {
    setIsLoading(true);
    const success = await unstakeOnSilverService(
      ethSilverAmount,
      contractAddressTontine,
      abiTontine
    );
    setIsLoading(false);
    if (success) {
      fetchUserSilverVaultData(
        userAddress,
        setSilverBalance,
        setSilverVaultOperation,
        setSilverInterest
      );
      onSilverClose();
      toast({
        title: "Congratulations!",
        description: `You have successfully unstake Eth on Silver Vault`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Error!",
        description:
          "An error occured while trying to unstake Eth on Silver Vault.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  } catch (err) {
    setIsLoading(false);
    if (err.message.includes("User rejected the request")) {
      toast({
        title: "Transaction Rejected",
        description: "You rejected the request.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Error!",
        description: "An error occured.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }
};

/** GOLD */
export const handleUnstakeOnGoldVault = async (
  ethGoldAmount,
  toast,
  onGoldClose,
  setIsLoading,
  fetchUserGoldVaultData,
  userAddress,
  setGoldBalance,
  setGoldVaultOperation,
  setGoldInterest,
  contractAddressTontine,
  abiTontine
) => {
  try {
    setIsLoading(true);
    const success = await unstakeOnGoldService(
      ethGoldAmount,
      contractAddressTontine,
      abiTontine
    );
    setIsLoading(false);
    if (success) {
      fetchUserGoldVaultData(
        userAddress,
        setGoldBalance,
        setGoldVaultOperation,
        setGoldInterest
      );
      onGoldClose();
      toast({
        title: "Congratulations!",
        description: `You have successfully stake Eth on Gold Vault`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Error!",
        description:
          "An error occured while trying to stake Eth on Gold Vault.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  } catch (err) {
    setIsLoading(false);
    if (err.message.includes("TINE must be unlocked for Gold Vault")) {
      toast({
        title: "Wait!",
        description: "You must unlock TINE to withdraw from Gold Vault.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    } else if (err.message.includes("User rejected the request")) {
      toast({
        title: "Transaction Rejected",
        description: "You rejected the request.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Error!",
        description: "An error occured.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }
};
