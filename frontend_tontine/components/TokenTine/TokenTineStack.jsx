import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/router';

import {
  Flex, Box, Text, useDisclosure, Button,
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalFooter, ModalBody, ModalCloseButton, FormControl,
  FormLabel, Input, useToast, Heading
} from "@chakra-ui/react";

import UnconnectedWallet from "@/components/UnconnectedWallet";

import { getTineEthRatio } from "@/services/api/EtherscanAPI";

import { useUser } from "@/context/UserContext";
import { useTine } from "@/context/TineContext";

import { handleBuyTine, handleSellTine, handleLockTine, handleUnlockTine } from "@/services/internal/handle/tokenTineHandleService";

const TokenTineStack = ({ isConnected, userAddress }) => {
  const { isUser,
    tineUserBalance,
    setTineUserBalance,
    userTineLockedDate,
    setTineLockedDate
  } = useUser(); 

  const { smartContractMinLockAmount,
    smartContractMinLockTime,
  } = useTine();
  
  const [clientIsConnected, setClientIsConnected] = useState(false);

  const router = useRouter();
  const { modal } = router.query;

  // Pour supprimer le paramètre de requête après une action
  const handleActionDone = () => {
    // Construire une nouvelle URL sans le paramètre modal
    const newPath = '/tokentine'; // Ou vous pouvez utiliser router.pathname pour être plus dynamique
    router.replace(newPath, undefined, { shallow: true });
  }

  // Création d'une nouvelle fonction onClose qui inclut handleActionDone
  const onBuyClose = () => {
    handleActionDone(); // Appelle handleActionDone pour gérer l'action terminée
    originalOnBuyClose(); // Puis ferme la modal en utilisant la fonction onClose originale de useDisclosure
  };

  const onLockClose = () => {
    handleActionDone(); // Appelle handleActionDone pour gérer l'action terminée
    originalOnLockClose(); // Puis ferme la modal en utilisant la fonction onClose originale de useDisclosure
  };
  
  const { isOpen: isBuyOpen, onOpen: onBuyOpen, onClose: originalOnBuyClose } = useDisclosure();
  const { isOpen: isLockOpen, onOpen: onLockOpen, onClose: originalOnLockClose } = useDisclosure();
  const { isOpen: isUnlockOpen, onOpen: onUnlockOpen, onClose: onUnlockClose } = useDisclosure();
  const { isOpen: isSellOpen, onOpen: onSellOpen, onClose: onSellClose } = useDisclosure();
 
  const [tineAmountToBuy, setTineAmountToBuy] = useState(0);
  const [tineAmountToSell, setTineAmountToSell] = useState(0);
  const [tineEthRatio, setTineEthRatio] = useState(0);
  const [ethCost, setEthCost] = useState(0);
  const [ethValue, setEthValue] = useState(0);

  const toast = useToast();

  //Way to manage SSR Problems
  useEffect(() => {
    // Since isConnected is only true on the client-side after hydration,
    // set clientIsConnected based on isConnected when component mounts.
    setClientIsConnected(isConnected);
  }, [isConnected]); 

  useEffect(() => {
    const fetchRatio = async () => {
      const ratio = await getTineEthRatio();
      if (ratio) {
        setTineEthRatio(ratio);
      }
    };

    fetchRatio();
  }, []);

  useEffect(() => {
    const costInEth = parseFloat(tineAmountToBuy) * tineEthRatio;
    setEthCost(costInEth);
  }, [tineAmountToBuy, tineEthRatio]);

  useEffect(() => {
    const valueInEth = parseFloat(tineAmountToSell) * tineEthRatio;
    setEthValue(valueInEth);
  }, [tineAmountToSell, tineEthRatio]);

  useEffect(() => {
    if (modal === 'buy' && clientIsConnected) {
      onBuyOpen();
    } else if (modal === 'lock' && clientIsConnected) {
      onLockOpen();
    }
  }, [modal, onBuyOpen, onLockOpen]);
  
  return (
    <>
      <Text className="hero-info-description" fontSize='1.5rem' marginTop='50px'>
        To access the GoldVault, participants are required to purchase a minimum of <span className="highlighted">{smartContractMinLockAmount.toString() / 10 ** 18} Tine</span>
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
        <UnconnectedWallet/>
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
            <ModalHeader>Buy Tine to access Gold Vault</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel htmlFor='amount'>Tine</FormLabel>
                <Input
                  id='amount'
                  type='number'
                  value={tineAmountToBuy}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (!isNaN(value) && value > 0) {
                      setTineAmountToBuy(value);
                    } else {
                      setTineAmountToBuy('');
                    }
                  }}
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.16)', // Adjust as needed
                  }}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel htmlFor='readonly-amount'>Price in Eth</FormLabel>
                <Input
                  id='readonly-amount'
                  type='number'
                  value={ethCost.toFixed(2)}
                  isReadOnly
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.16)',
                  }}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={() => {
                  handleBuyTine(
                    tineAmountToBuy,
                    ethCost.toFixed(2),
                    onBuyClose,
                    handleActionDone,
                    setTineUserBalance,
                    toast,
                    tineUserBalance
                  );
                  onBuyClose();
                }}
                isDisabled={!(tineAmountToBuy >= (smartContractMinLockAmount.toString() / 10 ** 18))}
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
                handleLockTine(onLockClose, setTineLockedDate, toast);
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
                handleUnlockTine(onUnlockClose, setTineLockedDate, toast);
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
                <Input id='amount' type='number'
                  value={tineAmountToSell}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (!isNaN(value) && value > 0) {
                      setTineAmountToSell(value);
                    } else {
                      setTineAmountToSell('');
                    }
                  }}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel htmlFor='readonly-amount'>Receive Eth</FormLabel>
                <Input
                  id='readonly-amount'
                  type='number'
                  value={ethValue.toFixed(2)}
                  isReadOnly
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.16)',
                  }}
                />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue" mr={3}
                onClick={() => {
                  handleSellTine(
                    tineAmountToSell,
                    onSellClose,
                    setTineUserBalance,
                    toast,
                    tineUserBalance
                  );
                  onSellClose();
                }}
                isDisabled={!(tineAmountToSell >= 1)}
              >
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
