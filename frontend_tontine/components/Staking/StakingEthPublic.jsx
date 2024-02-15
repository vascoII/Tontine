import React, { useState, useEffect } from 'react';

import {
  Flex, Box, Text, useDisclosure, Button,
  FormControl, FormLabel, Input, useToast,
  Heading, Link, Image
} from "@chakra-ui/react";

import { useUser } from "@/context/UserContext";
import { useTontine } from "@/context/TontineContext";
import { useTine } from "@/context/TineContext";

import { handleStakeOnSilverVault, handleStakeOnGoldVault } from "@/services/internal/handle/stakingEthHandleService";

import UnconnectedWallet from "@/components/UnconnectedWallet";
import CustomModal from "@/components/common/Modal/CustomModal";
import ActionButtons from "@/components/common/Buttons/ActionButtons";
import InfoCard from "@/components/common/Card/InfoCard";
import CustomSpinner from "@/components/common/CustomSpinner";

const StakingEthPublic = ({ isConnected, userAddress }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { isUser,
    tineUserBalance,
    setTineUserBalance,
    userTineLockedDate,
    setTineLockedDate
  } = useUser();
  
  const { silverVaultData,
    goldVaultData,
    rpSimpleAPR,
    rpNodeAPR,
    fetchVaultData
  } = useTontine();
  
  const { smartContractMinLockAmount,
    setSmartContractMinLockAmount,
    smartContractMinLockTime,
    setSmartContractMinLockTime,
  } = useTine();
  
  const [clientIsConnected, setClientIsConnected] = useState(false);

  const { isOpen: isSilverOpen, onOpen: onSilverOpen, onClose: onSilverClose } = useDisclosure();
  const { isOpen: isGoldOpen, onOpen: onGoldOpen, onClose: onGoldClose } = useDisclosure();
  
  const [isWarningOpen, setWarningOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState();
  const [ethSilverAmount, setEthSilverAmount] = useState(0);
  const [ethGoldAmount, setEthGoldAmount] = useState(0); 
  
  const toast = useToast();

  //Way to manage SSR Problems
  useEffect(() => {
    // Since isConnected is only true on the client-side after hydration,
    // set clientIsConnected based on isConnected when component mounts.
    setClientIsConnected(isConnected);
  }, [isConnected]); 

  /************ STAKING *****************/
  const handleGoldButtonClick = () => {
    if (tineUserBalance > 0 && userTineLockedDate !== '') {
      onGoldOpen(); // Ouvre la modal de staking
    } else if (tineUserBalance > 0 && userTineLockedDate == '') {
      setWarningMessage(true);
      setWarningOpen(true); // Ouvre la modal d'avertissement
    } else {
      setWarningMessage(false);
      setWarningOpen(true); // Ouvre la modal d'avertissement
    }
  };
  
  return (
    <>
      <Flex className='features-list-container' width='100%' justifyContent="center" alignItems="center" marginTop='20px'>
        <InfoCard
          imageSrc='./assets/profit1.svg'
          altText='Silver Vault'
          heading='Silver Vault'
          contentArray={[
            `Eth lock: ${silverVaultData.ethLocked.toString() / 10 ** 18}`,
            `Current APR: ${rpSimpleAPR}%`,
            `Actif Users: ${silverVaultData.activeUsers.toString()}`,
            `Total Interest Generated: ${silverVaultData.interestGenerated.toString() / 10 ** 19}`
          ]}
        />

        <InfoCard
          imageSrc='./assets/profit1.svg'
          altText='Gold Vault'
          heading='Gold Vault'
          contentArray={[
            `Eth lock: ${goldVaultData.ethLocked.toString() / 10 ** 18}`,
            `Current APR: ${rpNodeAPR}%`,
            `Actif Users: ${goldVaultData.activeUsers.toString()}`,
            `Total Interest Generated: ${goldVaultData.interestGenerated.toString() / 10 ** 19}`
          ]}
        />
      </Flex>
      
      {clientIsConnected ? (
        <ActionButtons
          buttons={[
            { onClick: onSilverOpen, text: "Stake Eth on Silver Vault" },
            { onClick: handleGoldButtonClick, text: "Stake Eth on Gold Vault" },
            // Add more buttons as needed
          ]}
        />
      ): (
          <UnconnectedWallet />  
      )}

      <Box>
        {/* Modal pour stake on silver vault */}
        <CustomModal
          isOpen={isSilverOpen}
          onClose={onSilverClose}
          headerContent="Stake Eth on Silver Vault"
          bodyContent={(
            <>
              <FormControl position="relative">
                <Box position="absolute" top="8%" transform="translateY(-50%)" zIndex="10">
                  <Image src="/assets/Ethereum.png" alt="eth" />
                </Box>
                <FormLabel htmlFor='amount' pl="45px">Stake ETH</FormLabel>
                <Input
                  id='amount'
                  type='number'
                  value={ethSilverAmount}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (!isNaN(value) && value > 0) {
                      setEthSilverAmount(value);
                    } else {
                      setEthSilverAmount('');
                    }
                  }}
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.16)',
                  }}
                />
                <Text fontSize="sm" color="gray.400" mt={2}>
                  Please note: Each withdrawal from the vault will incur a fee of 0.05%.
                  This fee is deducted from the withdrawal amount to cover transaction costs.
                  Ensure to consider this fee before planning your deposits.
                </Text>
              </FormControl>
              <Text mt={4} fontSize="lg">
                Current APR: {rpSimpleAPR}%
              </Text>
            </>
          )}
          footerContent={(
            <Button
                colorScheme="blue"
                mr={3}
                onClick={() => {
                  handleStakeOnSilverVault(
                    ethSilverAmount,
                    fetchVaultData,
                    onSilverClose,
                    toast,  
                    setIsLoading
                  );
                  onSilverClose();
                }}
                isDisabled={!(ethSilverAmount > 1)}
              >
                Stake
            </Button>
          )}
        />
        {/* Modal pour stake on silver vault */}
        <CustomModal
          isOpen={isGoldOpen}
          onClose={onGoldClose}
          headerContent="Stake Eth on Gold Vault"
          bodyContent={(
            <>
              <FormControl position="relative">
                <Box position="absolute" top="8%" transform="translateY(-50%)" zIndex="10">
                  <Image src="/assets/Ethereum.png" alt="eth" />
                </Box>
                <FormLabel htmlFor='amount' pl="45px">Stake ETH</FormLabel>
                <Input
                  id='amount'
                  type='number'
                  value={ethGoldAmount}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (!isNaN(value) && value > 0) {
                      setEthGoldAmount(value);
                    } else {
                      setEthGoldAmount('');
                    }
                  }}
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.16)', // Adjust as needed
                  }}
                />
                <Text fontSize="sm" color="gray.400" mt={2}>
                  Please note: Each withdrawal from the vault will incur a fee of 0.05%.
                  This fee is deducted from the withdrawal amount to cover transaction costs.
                  Ensure to consider this fee before planning your deposits.
                </Text>
              </FormControl>
              <Text mt={4} fontSize="lg">
                Current APR: {rpNodeAPR}%
              </Text>
            </>
          )}
          footerContent={(
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                handleStakeOnGoldVault(
                  ethGoldAmount,
                  fetchVaultData,
                  onGoldClose,
                  toast,  
                  setIsLoading
                );
                onGoldClose();
              }}
              isDisabled={!(ethGoldAmount > 1)}
            >
              Stake
            </Button>
          )}
        />
        {/* Modal d'avertissement */}
        <CustomModal
          isOpen={isWarningOpen}
          onClose={() => setWarningOpen(false)}
          headerContent="Stake Eth on Gold Vault"
          bodyContent={(
            <>
              {warningMessage && <Text>Contratulations! You already have {tineUserBalance} Tine but you need to lock {tineUserBalance == 1 ? 'it' : 'them'} to stake.</Text>}
              {!warningMessage && <Text>You need to buy at least {smartContractMinLockAmount.toString() / 10 ** 18} Tine and lock {smartContractMinLockAmount.toString() / 10 ** 18 == 1 ? 'it' : 'them'} to stake.</Text>}
            </>
          )}
          footerContent={(
            <>
              {warningMessage && <Button colorScheme="blue" onClick={() => window.location.href = "/tokentine?modal=lock"}>Go to Tine lock</Button>}
              {!warningMessage && <Button colorScheme="blue" onClick={() => window.location.href = "/tokentine?modal=buy"}>Go to Tine purchase</Button>}
            </>
          )}
        />
      </Box>
      {isLoading && <CustomSpinner/>}
    </>
  );
};

export default StakingEthPublic;
