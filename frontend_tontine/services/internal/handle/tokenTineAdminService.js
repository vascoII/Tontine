//services/internal/handle/tokenTineAdminService.js
import {
  mintMonthlyService,
  setSmartContracMinLockTimeService,
  setSmartContracMinLockAmountService,
  withdrawEthService,
  setSmartContractMaxBalanceService,
} from "@/services/contracts/admin/tineServices";

/** MINT MONTHLY */
export const handleSmartContractMintMonthly = async (
  setSmartContractMintMonthly,
  setSmartContractCurrentSupply,
  smartContractCurrentSupply,
  setSmartContractTokenBalance,
  smartContractTokenBalance,
  toast
) => {
  try {
    const result = await mintMonthlyService();
    if (result) {
      setSmartContractMintMonthly(result);
      setSmartContractCurrentSupply(
        Number(smartContractCurrentSupply) + 100 * 10 ** 18
      );
      setSmartContractTokenBalance(
        Number(smartContractTokenBalance) + 100 * 10 ** 18
      );
      toast({
        title: "Success",
        description: "Successfully minted new Tine.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      return true;
    }
  } catch (err) {
    console.log(err.message);
    if (err.message.includes("Minting not yet allowed")) {
      toast({
        title: "Transaction Rejected",
        description: "Mint period is not open yet.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Error!",
        description: "An error occured on mint monthly.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    return false;
  }
};

/** WITHDRAW ETH */
export const handleSmartContractWithdrawEth = async (
  smartContractWithdrawEth,
  userAddress,
  setSmartContractWithdrawEth,
  toast
) => {
  try {
    const result = await withdrawEthService(
      smartContractWithdrawEth,
      userAddress
    );
    if (result) {
      setSmartContractWithdrawEth(smartContractWithdrawEth);
      toast({
        title: "Congratulations!",
        description: `You have successfully withdraw Eth.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      return true;
    }
  } catch (err) {
    toast({
      title: "Error!",
      description: "An error occured on eth withdraw.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
    return false;
  }
};

/** SET MAX BALANCE */
export const handleSetSmartContractMaxBalance = async (
  smartContractNewMaxBalance,
  setSmartContractMaxBalance,
  toast
) => {
  try {
    const result = await setSmartContractMaxBalanceService(
      smartContractNewMaxBalance
    );
    if (result) {
      setSmartContractMaxBalance(smartContractNewMaxBalance * 10 ** 18);
      toast({
        title: "Congratulations!",
        description: `You have successfully change the Max Balance.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      return true;
    }
    return false;
  } catch (err) {
    toast({
      title: "Error!",
      description: "An error occured on setting new Max Balance.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
    return false;
  }
};

/** LOCK TIME */
export const handleSetSmartContractMinLockTime = async (
  smartContractNewMinLockTime,
  setSmartContractMinLockTime,
  toast
) => {
  try {
    const result = await setSmartContracMinLockTimeService(
      smartContractNewMinLockTime
    );
    if (result) {
      setSmartContractMinLockTime(smartContractNewMinLockTime);
      toast({
        title: "Congratulations!",
        description: `You have successfully change the min lock time.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      return true;
    }
    return false;
  } catch (err) {
    console.log(err.message);
    toast({
      title: "Error!",
      description: "An error occured on current min lock time.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
    return false;
  }
};

/** LOCK AMOUNT */
export const handleSetSmartContractMinLockAmount = async (
  smartContractNewMinLockAmount,
  setSmartContractMinLockAmount,
  toast
) => {
  try {
    const result = await setSmartContracMinLockAmountService(
      smartContractNewMinLockAmount
    );
    if (result) {
      setSmartContractMinLockAmount(smartContractNewMinLockAmount * 10 ** 18);
      toast({
        title: "Congratulations!",
        description: `You have successfully change the min lock amount.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      return true;
    }
    return false;
  } catch (err) {
    toast({
      title: "Error!",
      description: "An error occured on current min lock amount.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
    return false;
  }
};
