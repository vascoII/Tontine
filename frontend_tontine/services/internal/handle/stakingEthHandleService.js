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
  toast
) => {
  try {
    const success = await stakeOnSilverService(ethSilverAmount);
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
    console.log(err.message);
    toast({
      title: "Error!",
      description: "An error occured.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  }
};

/** GOLD */
export const handleStakeOnGoldVault = async (
  ethGoldAmount,
  fetchVaultData,
  onGoldClose,
  toast
) => {
  try {
    const success = await stakeOnGoldService(ethGoldAmount);
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
    console.log(err.message);
    toast({
      title: "Error!",
      description: "An error occured.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  }
};

/** SILVER */
export const handleUnstakeOnSilverVault = async (
  ethSilverAmount,
  toast,
  fetchUserSilverVaultData,
  onSilverClose
) => {
  try {
    const success = await unstakeOnSilverService(ethSilverAmount);
    if (success) {
      fetchUserSilverVaultData();
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
    toast({
      title: "Error!",
      description: "An error occured.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  }
};

/** GOLD */
export const handleUnstakeOnGoldVault = async (
  ethGoldAmount,
  toast,
  fetchUserGoldVaultData,
  onGoldClose
) => {
  try {
    const success = await unstakeOnGoldService(ethGoldAmount);
    if (success) {
      fetchUserGoldVaultData();
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
    if (err.message.includes("TINE must be unlocked for Gold Vault")) {
      toast({
        title: "Error!",
        description: "You must unlock TINE to withdraw from Gold Vault.",
        status: "error",
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
