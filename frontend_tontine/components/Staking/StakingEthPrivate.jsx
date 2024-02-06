import React, { useState, useEffect } from 'react';

import {
  Flex, Box, Text, useDisclosure, Button,
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalFooter, ModalBody, ModalCloseButton, FormControl,
  FormLabel, Input, useToast, Heading
} from "@chakra-ui/react";

import { useUser } from "@/context/UserContext";

import {
  buyTineService,
  lockTineService, unlockTineService,
  sellTineService, getTineLockedDateService,
  getUserTineBalanceService
} from "@/services/contracts/users/tineServices";

const StakingEthPrivate = ({ isConnected, userAddress }) => {
  const { isUser } = useUser();
  
  const [clientIsConnected, setClientIsConnected] = useState(false);

  const { isOpen: isSilverOpen, onOpen: onSilverOpen, onClose: onSilverClose } = useDisclosure();
  const { isOpen: isGoldOpen, onOpen: onGoldOpen, onClose: onGoldClose } = useDisclosure();
 
  const [ethSilverAmount, setEthSilverAmount] = useState();
  const [ethGoldAmount, setEthGoldAmount] = useState(); 
  const [tineUserBalance, setTineUserBalance] = useState(0);
  const [userTineLockedDate, setTineLockedDate] = useState('');

  //Way to manage SSR Problems
  useEffect(() => {
    // Since isConnected is only true on the client-side after hydration,
    // set clientIsConnected based on isConnected when component mounts.
    setClientIsConnected(isConnected);
  }, [isConnected]); 

  useEffect(() => {
    if(isConnected) {
      //handleUserSilverVaultData();
      //handleUserGoldVaultData();
    }
  }, [isConnected, userAddress])
  

  return (
    <>
      <Flex className='features-list-container' width='100%' justifyContent="center" alignItems="center" marginTop='20px'>
        <Box className="card-container" width="100%">
          <img src='./assets/profit1.svg' alt="Balance" />
          <Heading>Silver Vault</Heading>
          <Text textAlign='right'>Eth lock: </Text>
          <Text textAlign='right'>Current APR: </Text>
          <Text textAlign='right'>Actif User</Text>
          <Text textAlign='right'>Yield made until today: </Text>
        </Box>
        <Box className="card-container" width="100%">
          <img src='./assets/profit1.svg' alt="Balance" />
          <Heading>Gold Vault</Heading>
          <Text textAlign='right'>Eth lock: </Text>
          <Text textAlign='right'>Current APR: </Text>
          <Text textAlign='right'>Actif User</Text>
          <Text textAlign='right'>Yield made until today: </Text>
        </Box>
      </Flex>
      
      {clientIsConnected &&
        <Flex className='features-list-container' width='100%' justifyContent="space-between" alignItems="center" marginTop='50px'>
          {/* Exemple de carte pour l'achat */}
          <Box className="card-container" onClick={onSilverOpen} width="100%" textAlign="center">
            {/* Vos autres éléments de carte ici */}
            <Text>Unstake Eth on Silver Vault</Text>
          </Box>
          {/* Exemple de carte pour l'achat */}
          <Box className="card-container" onClick={onGoldOpen} width="100%" textAlign="center">
            {/* Vos autres éléments de carte ici */}
            <Text>Unstake Eth on Gold Vault</Text>
          </Box>
        </Flex>
      }

      <Box>
        {/* Modal pour unstake on silver vault */}
        <Modal isOpen={isSilverOpen} onClose={onSilverClose}>
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
            <ModalHeader>Unstake Eth on Silver Vault</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel htmlFor='amount'>Amount</FormLabel>
                <Input
                  id='amount'
                  type='number'
                  value={ethSilverAmount}
                  onChange={(e) => setEthSilverAmount(e.target.value)}
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
                  handleUnStakeOnSilverVault(ethSilverAmount);
                  onSilverClose();
                }}
              >
                Unstake
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        {/* Modal pour stake on silver vault */}
        <Modal isOpen={isGoldOpen} onClose={onGoldClose}>
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
            <ModalHeader>Unstake Eth on Silver Vault</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel htmlFor='amount'>Amount</FormLabel>
                <Input
                  id='amount'
                  type='number'
                  value={ethGoldAmount}
                  onChange={(e) => setEthGoldAmount(e.target.value)}
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
                  handleUnStakeOnGoldVault(ethGoldAmount);
                  onGoldClose();
                }}
              >
                Unstake
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
};

export default StakingEthPrivate;
