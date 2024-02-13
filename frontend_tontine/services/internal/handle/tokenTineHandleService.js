import {
  buyTineService,
  lockTineService,
  unlockTineService,
  sellTineService,
} from "@/services/contracts/users/tineServices";

/** BUYING TINE HANDLER */
export const handleBuyTine = async (
  tineAmountToBuy,
  ethCost,
  onBuyClose,
  handleActionDone,
  setTineUserBalance,
  toast,
  tineUserBalance
) => {
  try {
    const success = await buyTineService(tineAmountToBuy, ethCost);
    if (success) {
      onBuyClose();
      handleActionDone();
      setTineUserBalance(tineUserBalance + tineAmountToBuy);
      toast({
        title: "Congratulations!",
        description: `You have successfully bought Tine`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Error!",
        description: "An error occured while trying to buy Tine.",
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

/** SELLING TINE HANDLER */
export const handleSellTine = async (
  tineAmountToSell,
  onSellClose,
  setTineUserBalance,
  toast,
  tineUserBalance
) => {
  try {
    const success = await sellTineService(tineAmountToSell);
    if (success) {
      onSellClose();
      setTineUserBalance(tineUserBalance - tineAmountToSell);
      toast({
        title: "Congratulations!",
        description: `You have successfully sell Tine`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  } catch (err) {
    console.log(err.message);
    if (err.message.includes("Amount must be greater than 0")) {
      toast({
        title: "Error!",
        description: "",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else if (
      err.message.includes(
        "Must retain at least MIN_LOCK_AMOUNT TINE when locked"
      )
    ) {
      toast({
        title: "Error!",
        description:
          "As part of Gold vault community your remaining amount of Tine can not be null.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else if (err.message.includes("Insufficient Eth balance in protocol")) {
      toast({
        title: "Error!",
        description: "Insufficient Eth balance in protocol.",
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

/** LOCK TINE HANDLER */
export const handleLockTine = async (onLockClose, setTineLockedDate, toast) => {
  try {
    const success = await lockTineService();
    if (success) {
      onLockClose();
      const date = new Date();
      const formattedDate = date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      setTineLockedDate(formattedDate);

      toast({
        title: "Congratulations!",
        description: `You have successfully lock your Tine`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Error!",
        description: "An error occured while trying to lock your Tine.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  } catch (err) {
    if (err.message.includes("TINE already locked")) {
      toast({
        title: "Congratulations!",
        description: `Your Tine are already locked.`,
        status: "success",
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

/** UNLOCK TINE HANDLER */
export const handleUnlockTine = async (
  onUnlockClose,
  setTineLockedDate,
  toast
) => {
  try {
    const success = await unlockTineService();
    if (success) {
      onUnlockClose();
      setTineLockedDate("");
      toast({
        title: "Congratulations!",
        description: `You have successfully unlock your Tine`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Error!",
        description: "An error occured while trying to unlock your Tine.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  } catch (err) {
    console.log(err.message);
    if (err.message.includes("No TINE locked")) {
      toast({
        title: "Error!",
        description: "You dont have Tine to unlock.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else if (err.message.includes("Lock period not over")) {
      toast({
        title: "Error!",
        description: "Lock period is not over yet.",
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
