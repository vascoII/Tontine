import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/router';

import {
  Flex, Box, Text, useDisclosure, Button,
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalFooter, ModalBody, ModalCloseButton, FormControl,
  FormLabel, Input, useToast, Heading
} from "@chakra-ui/react";

import {
  buyTineService,
  lockTineService,
  unlockTineService,
  sellTineService
} from "@/services/contracts/users/tineServices";

import { useUser } from "@/context/UserContext";

const TokenTineStack = ({ isConnected, userAddress }) => {
  const { isUser,
    tineUserBalance,
    setTineUserBalance,
    userTineLockedDate,
    setTineLockedDate
  } = useUser(); 
  
  const [clientIsConnected, setClientIsConnected] = useState(false);

  const router = useRouter();
  const { modal } = router.query;

  const { isOpen: isBuyOpen, onOpen: onBuyOpen, onClose: onBuyClose } = useDisclosure();
  const { isOpen: isLockOpen, onOpen: onLockOpen, onClose: onLockClose } = useDisclosure();
  const { isOpen: isUnlockOpen, onOpen: onUnlockOpen, onClose: onUnlockClose } = useDisclosure();
  const { isOpen: isSellOpen, onOpen: onSellOpen, onClose: onSellClose } = useDisclosure();
 
  const [tineAmountToBuy, setTineAmountToBuy] = useState(1);
  const [tineAmountToSell, setTineAmountToSell] = useState(0);

  const toast = useToast();

  //Way to manage SSR Problems
  useEffect(() => {
    // Since isConnected is only true on the client-side after hydration,
    // set clientIsConnected based on isConnected when component mounts.
    setClientIsConnected(isConnected);
  }, [isConnected]); 

  useEffect(() => {
    if (modal === 'buy' && clientIsConnected) {
      onBuyOpen();
    }
  }, [modal, onBuyOpen]);
  
  /** BUYING TINE HANDLER */
  const handleBuyTine = async (tineAmountToBuy) => {
    try {
      const success = await buyTineService(tineAmountToBuy);
      if (success) {
        onBuyClose();
        handleUserTineBalance();
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
      console.log(err.message)
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
  const handleSellTine = async (tineAmountToSell) => {
    try {
      const success = await sellTineService(tineAmountToSell);
      if (success) {
        onSellClose();
        handleUserTineBalance();
        toast({
          title: "Congratulations!",
          description: `You have successfully sell Tine`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      if (err.message.includes("Amount must be greater than 0")) {
        toast({
          title: "Error!",
          description: "",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else if (err.message.includes("Must retain at least MIN_LOCK_AMOUNT TINE when locked")) {
        toast({
          title: "Error!",
          description: "As part of Gold vault community your remaining amount of Tine can not be null.",
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
  const handleLockTine = async () => {
    try {
      const success = await lockTineService();
      if (success) {
        onLockClose();
        handleUserLockTime();
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
      console.log(err.message)
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
  const handleUnlockTine = async () => {
    try {
      const success = await unlockTineService();
      if (success) {
        onUnlockClose();
        setTineLockedDate('');
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
      console.log(err.message)
      if (err.message.includes("No TINE locked")) {
        toast({
          title: "Error!",
          description: "You dont have Tine to unlock.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else if (err.message.includes("TINE still locked")) {
        toast({
          title: "Error!",
          description: "Lock time is not over yet.",
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

  return (
    <>
      <Text className="hero-info-description" fontSize='1.5rem' marginTop='50px'>
        To access the GoldVault, participants are required to purchase a minimum of one Tine
      </Text>
      <Text className="hero-info-description" fontSize='1.5rem' marginTop='10px'>
        By locking in your Tine, you unlock higher yield rates,
      </Text>
      <Text className="hero-info-description" fontSize='1.5rem'>
        thus multiplying the returns on your staked ETH.
      </Text>
      
      {clientIsConnected ? (
        <Flex className='features-list-container' width='100%' justifyContent="center" alignItems="center" marginTop='20px'>
          <Box className="card-container">
            <img src='./assets/profit1.svg' alt="Balance" />
            <Heading>Your current Tine balance</Heading>
            <Text fontSize="xl" className="metric-value" color='#ffff' textAlign='right'>{ tineUserBalance.toString() } TINE</Text>
          </Box>
          <Box className="card-container">
            <img src='./assets/insurance1.svg' alt="Lock" />
            <Heading>Lock Date started</Heading>
            <Text fontSize="xl" className="metric-value" color='#ffff' textAlign='right'>{ userTineLockedDate.toString() }</Text>
          </Box>
        </Flex>
      ) : (
        <Flex className='features-list-container' width='100%' justifyContent="center" alignItems="center" marginTop='20px'>
          <Box className="card-container">
            <img src='./assets/profit1.svg' alt="Balance" />
            <Heading>Connect your wallet and start your journey with Tontine</Heading>
            <Text fontSize="xl" className="metric-value" color='#ffff' textAlign='right'></Text>
          </Box>
        </Flex>
      )}
      
      {clientIsConnected &&
        <Flex className='features-list-container' width='100%' justifyContent="center" alignItems="center" marginTop='50px'>
          {/* Exemple de carte pour l'achat */}
          <Box className="card-container" onClick={onBuyOpen}>
            {/* Vos autres éléments de carte ici */}
            <Text>Buy Tine</Text>
          </Box>
          {tineUserBalance >= 1 && userTineLockedDate == '' &&
            <Box className="card-container" onClick={onLockOpen}>
              {/* Vos autres éléments de carte ici */}
              <Text>Lock Tine</Text>
            </Box>
          }
          
          {userTineLockedDate != '' && 
            <Box className="card-container" onClick={onUnlockOpen}>
              {/* Vos autres éléments de carte ici */}
              <Text>Unlock Tine</Text>
            </Box>
          }  
          
          {tineUserBalance > 0 && 
            <Box className="card-container" onClick={onSellOpen}>
              {/* Vos autres éléments de carte ici */}
              <Text>Sell Tine</Text>
            </Box>
          }
        </Flex>
      }

      <Box>
        {/* Modal pour l'achat de Tine */}
        <Modal isOpen={isBuyOpen} onClose={onBuyClose}>
          <ModalOverlay />
          <ModalContent
            style={{
              padding: '20px',
              backgroundColor: '#131330',
              color: '#fff',
              borderRadius: '10px',
              border: 'double 1px transparent',
              backgroundClip: 'padding-box, border-box',
              backgroundOrigin: 'border-box',
              backgroundImage:
                'linear-gradient(#131330 0 0) padding-box, linear-gradient(to top left, transparent, #30bddc) border-box',
            }}
          >
            <ModalHeader>Buy Tine</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel htmlFor='amount'>Amount to Buy</FormLabel>
                <Input
                  id='amount'
                  type='number'
                  value={tineAmountToBuy}
                  onChange={(e) => setTineAmountToBuy(e.target.value)}
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.16)', // Adjust as needed
                  }}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={() => {
                  handleBuyTine(tineAmountToBuy);
                  onBuyClose();
                }}
              >
                Buy
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        {/* Modal pour lock de Tine */}
        <Modal isOpen={isLockOpen} onClose={onLockClose}>
          <ModalOverlay />
          <ModalContent
            style={{
              padding: '20px',
              backgroundColor: '#131330',
              color: '#fff',
              borderRadius: '10px',
              border: 'double 1px transparent',
              backgroundClip: 'padding-box, border-box',
              backgroundOrigin: 'border-box',
              backgroundImage:
                'linear-gradient(#131330 0 0) padding-box, linear-gradient(to top left, transparent, #30bddc) border-box',
            }}
          >
            <ModalHeader>Lock Tine</ModalHeader>
            <ModalCloseButton />
            <ModalBody/>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={() => {
                handleLockTine();
                onLockClose();
              }}>
                Lock
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        {/* Modal pour unlock de Tine */}
        <Modal isOpen={isUnlockOpen} onClose={onUnlockClose}>
          <ModalOverlay />
          <ModalContent
            style={{
              padding: '20px',
              backgroundColor: '#131330',
              color: '#fff',
              borderRadius: '10px',
              border: 'double 1px transparent',
              backgroundClip: 'padding-box, border-box',
              backgroundOrigin: 'border-box',
              backgroundImage:
                'linear-gradient(#131330 0 0) padding-box, linear-gradient(to top left, transparent, #30bddc) border-box',
            }}
          >
            <ModalHeader>Unlock Tine</ModalHeader>
            <ModalCloseButton />
            <ModalBody/>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={() => {
                handleUnlockTine();
                onUnlockClose();
              }}>
                Unlock
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        {/* Modal pour sell de Tine */}
        <Modal isOpen={isSellOpen} onClose={onSellClose}>
          <ModalOverlay />
          <ModalContent
            style={{
              padding: '20px',
              backgroundColor: '#131330',
              color: '#fff',
              borderRadius: '10px',
              border: 'double 1px transparent',
              backgroundClip: 'padding-box, border-box',
              backgroundOrigin: 'border-box',
              backgroundImage:
                'linear-gradient(#131330 0 0) padding-box, linear-gradient(to top left, transparent, #30bddc) border-box',
            }}
          >
            <ModalHeader>Sell Tine</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel htmlFor='amount'>Amount to Sell</FormLabel>
                <Input id='amount' type='number' value={tineAmountToSell} onChange={(e) => setTineAmountToSell(e.target.value)} />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={() => {
                handleSellTine(tineAmountToSell);
                onSellClose();
              }}>
                Sell
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
};

export default TokenTineStack;
