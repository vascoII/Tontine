import React, { useState, useEffect } from 'react';

import {
  Box, Heading, Text, Collapse, Button, Flex, useToast, useDisclosure,
  Table, Thead, Tbody, Tr, Th, Td, FormControl, FormLabel, Input
} from "@chakra-ui/react";

import { useChainId } from "wagmi";

import { useTine } from "@/context/TineContext";

import { getContractInfo } from "@/services/contracts/contractInfo";

import CustomModal from "@/components/common/Modal/CustomModal";
import ActionButtons from "@/components/common/Buttons/ActionButtons";

import {
  handleSmartContractMintMonthly,
  handleSmartContractWithdrawEth,
  handleSetSmartContractMaxBalance,
  handleSetSmartContractMinLockTime,
  handleSetSmartContractMinLockAmount
} from "@/services/internal/handle/tokenTineAdminService";

const TokenTineAdmin = ({ isConnected, userAddress }) => {
  const [showContent, setShowContent] = useState(false);
  const handleToggle = () => setShowContent(!showContent);
  const [clientIsConnected, setClientIsConnected] = useState(false);

  const {
    smartContractTokenBalance,
    setSmartContractTokenBalance,
    smartContractEthBalance,
    setSmartContractEthBalance,
    smartContractMaxSupply,
    setSmartContractMaxSupply,
    smartContractMaxBalance,
    setSmartContractMaxBalance,
    smartContractCurrentSupply,
    setSmartContractCurrentSupply,
    smartContractMintMonthly,
    setSmartContractMintMonthly,
    smartContractMinLockTime,
    setSmartContractMinLockTime,
    smartContractMinLockAmount,
    setSmartContractMinLockAmount
  } = useTine();
  
  const chainId = useChainId();
  const {
    contractAddressTine: contractAddressTine,
    abiTine: abiTine,
  } = getContractInfo(chainId);

  const [smartContractWithdrawEth, setSmartContractWithdrawEth] = useState(0);
  const [smartContractNewMinLockTime, setSmartContractNewMinLockTime] = useState(0);
  const [smartContractNewMinLockAmount, setSmartContractNewMinLockAmount] = useState(0);
  const [smartContractNewMaxBalance, setSmartContractNewMaxBalance] = useState(0);

  const toast = useToast();

  const { isOpen: isMintOpen, onOpen: onMintOpen, onClose: onMintClose } = useDisclosure();
  const { isOpen: isLockTimeOpen, onOpen: onLockTimeOpen, onClose: onLockTimeClose } = useDisclosure();
  const { isOpen: isLockAmountOpen, onOpen: onLockAmountOpen, onClose: onLockAmountClose } = useDisclosure();
  const { isOpen: isWithdrawOpen, onOpen: onWithdrawOpen, onClose: onWithdrawClose } = useDisclosure();
  const { isOpen: isBalanceOpen, onOpen: onBalanceOpen, onClose: onBalanceClose } = useDisclosure();

  //Way to manage SSR Problems
  useEffect(() => {
    // Since isConnected is only true on the client-side after hydration,
    // set clientIsConnected based on isConnected when component mounts.
    setClientIsConnected(isConnected);
  }, [isConnected]); 

  // Définition des boutons et de leurs actions
  const buttons = [
    { text: "Withdraw Eth", onClick: onWithdrawOpen },
    { text: "Mint Tine", onClick: onMintOpen },
    { text: "Change Max Balance", onClick: onBalanceOpen },
    { text: "Change Lock Time", onClick: onLockTimeOpen },
    { text: "Change Lock Amount", onClick: onLockAmountOpen },
  ];

    
  return (
    <>
      {isConnected && 
        <Box
          className="card-container"
          p={4}
          w="full" 
          maxW="95%" 
          h="auto" 
          my={5} 
          mx="auto"
        >
        <img src='./assets/wallet1.svg' alt="TineAdmin" />
        <Heading
          onClick={handleToggle}
          cursor="pointer"
        >
          Tine Smart contract Manager
        </Heading>
        <Collapse in={showContent} animateOpacity>
          <Box
            p="10px"
            color="white"
            mt="4"
            bg="teal.500"
            rounded="md"
            shadow="md"
            bgColor="#131330"
          >
            <Flex className='features-list-container-admin' width='100%' justifyContent="center" alignItems="center" marginTop='20px'>
              <Box>
                <Heading size="md" mb={4}>Token and Contract Stats</Heading>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Td>Token Balance</Td>
                      <Td>Max Supply</Td>
                      <Td>Current Supply</Td>
                      <Td>Current Balance</Td>
                      <Td>Max Balance</Td>
                      <Td>Current Lock Time</Td>
                      <Td>Current Lock Amount</Td>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td isNumeric>{Number(smartContractTokenBalance) / 10 ** 18} Tine</Td>
                      <Td isNumeric>{smartContractMaxSupply} Tine</Td>
                      <Td isNumeric>{Number(smartContractCurrentSupply) / 10 ** 18} Tine</Td>
                      <Td isNumeric>{Number(smartContractEthBalance) / 10 ** 18} Eth</Td>
                      <Td isNumeric>{Number(smartContractMaxBalance) / 10 ** 18} Eth</Td>
                      <Td isNumeric>{smartContractMinLockTime.toString()} seconds</Td>
                      <Td isNumeric>{Number(smartContractMinLockAmount) / 10 ** 18} Tine</Td>
                    </Tr>
                  </Tbody>
                </Table>  
              </Box>  
            </Flex>
            <Flex className='features-list-container-admin' width='100%' justifyContent="center" alignItems="center" marginTop='20px'>
               <ActionButtons buttons={buttons} />
            </Flex>  
          </Box>
        </Collapse>
        </Box>
      }
      <Box>
        {/* Modal pour mint Tine */}
        <CustomModal
          isOpen={isMintOpen}
          onClose={onMintClose}
          headerContent="Mint Tine"
          bodyContent={
            // Ici, tu peux ajouter d'autres éléments au corps du modal si nécessaire.
            // Pour l'instant, j'ai laissé le corps vide comme dans ton exemple.
            <></>
          }
          footerContent={
            <Button colorScheme="blue" mr={3} onClick={() => {
              handleSmartContractMintMonthly(
                setSmartContractMintMonthly,
                setSmartContractCurrentSupply,
                smartContractCurrentSupply,
                setSmartContractTokenBalance,
                smartContractTokenBalance,
                toast,
                contractAddressTine,
                abiTine
              );
              onMintClose(); // Ferme le modal après l'action
            }}>
              Mint
            </Button>
          }
        />
        {/* Modal pour changer le mini lock time */}
        <CustomModal
          isOpen={isLockTimeOpen}
          onClose={onLockTimeClose}
          headerContent="Change Minimum Lock Time"
          bodyContent={
            <FormControl>
              <FormLabel htmlFor='amount'>Time in seconds</FormLabel>
              <Input 
                id='amount' 
                type='number' 
                value={smartContractNewMinLockTime} 
                onChange={(e) => setSmartContractNewMinLockTime(e.target.value)}
              />
            </FormControl>
          }
          footerContent={
            <Button 
              colorScheme="blue" 
              mr={3} 
              onClick={() => {
                handleSetSmartContractMinLockTime(
                  smartContractNewMinLockTime,
                  setSmartContractMinLockTime,
                  toast
                );
                 onLockTimeClose();
              }}
            >
              Change
            </Button>
          }
        />
        {/* Modal pour le mini lock amount */}
        <CustomModal
          isOpen={isLockAmountOpen}
          onClose={onLockAmountClose}
          headerContent="Change Minimum Lock Amount"
          bodyContent={
            <FormControl>
              <FormLabel htmlFor='amount'>Amount in Tine</FormLabel>
              <Input 
                id='amount' 
                type='number' 
                value={smartContractNewMinLockAmount} 
                onChange={(e) => setSmartContractNewMinLockAmount(e.target.value)}
              />
            </FormControl>
          }
          footerContent={
            <Button 
              colorScheme="blue" 
              mr={3} 
              onClick={() => {
                handleSetSmartContractMinLockAmount(
                  smartContractNewMinLockAmount,
                  setSmartContractMinLockAmount,
                  toast
                );
                onLockAmountClose(); // Ferme le modal après l'action
              }}
            >
              Change
            </Button>
          }
        />
        {/* Modal pour withdraw */}
        <CustomModal
          isOpen={isWithdrawOpen}
          onClose={onWithdrawClose}
          headerContent="Withdraw"
          bodyContent={
            <FormControl>
              <FormLabel htmlFor='amount'>Amount to withdraw</FormLabel>
              <Input 
                id='amount' 
                type='number' 
                value={smartContractWithdrawEth} 
                onChange={(e) => setSmartContractWithdrawEth(e.target.value)}
              />
            </FormControl>
          }
          footerContent={
            <Button 
              colorScheme="blue" 
              mr={3} 
              onClick={() => {
                handleSmartContractWithdrawEth(
                  smartContractWithdrawEth,
                  userAddress,
                  setSmartContractWithdrawEth,
                  toast
                );
                onWithdrawClose(); // Ferme le modal après l'action si réussie
              }}
            >
              Withdraw
            </Button>
          }
        />
        {/* Modal pour max balance */}
        <CustomModal
          isOpen={isBalanceOpen}
          onClose={onBalanceClose}
          headerContent="Max Balance"
          bodyContent={
            <FormControl>
              <FormLabel htmlFor='amount'>New max balance in Eth</FormLabel>
              <Input 
                id='amount' 
                type='number' 
                value={smartContractNewMaxBalance} 
                onChange={(e) => setSmartContractNewMaxBalance(e.target.value)}
              />
            </FormControl>
          }
          footerContent={
            <Button 
              colorScheme="blue" 
              mr={3} 
              onClick={() => {
                handleSetSmartContractMaxBalance(
                  smartContractNewMaxBalance,
                  setSmartContractMaxBalance,
                  toast
                );
                onBalanceClose(); // Ferme le modal après l'action
              }}
            >
              Change
            </Button>
          }
        />
      </Box>
    </>
  );
};

export default TokenTineAdmin;
