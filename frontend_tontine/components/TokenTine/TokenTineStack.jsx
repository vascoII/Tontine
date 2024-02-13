import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/router';

import {
  Flex, Box, Text, useDisclosure, Button,
  FormControl, FormLabel, Input,
  useToast, Heading, Image
} from "@chakra-ui/react";

import { getTineEthRatio } from "@/services/api/EtherscanAPI";

import { useUser } from "@/context/UserContext";
import { useTine } from "@/context/TineContext";

import {
  handleBuyTine,
  handleSellTine,
  handleLockTine,
  handleUnlockTine
} from "@/services/internal/handle/tokenTineHandleService";

import UnconnectedWallet from "@/components/UnconnectedWallet";
import CustomModal from "@/components/common/Modal/CustomModal";

const TokenTineStack = ({ isConnected, userAddress }) => {
  const { isUser,
    tineUserBalance,
    setTineUserBalance,
    userTineLockedDate,
    setTineLockedDate
  } = useUser(); 

  const { smartContractMinLockAmount,
    smartContractMinLockTime,
    smartContractTokenBalance
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
        <CustomModal
          isOpen={isBuyOpen}
          onClose={onBuyClose}
          headerContent="Buy Tine to access Gold Vault"
          bodyContent={(
            <>
              <FormControl position="relative">
                <Box position="absolute" top="15%" left="5px" transform="translateY(-50%)" zIndex="10">
                  <Image src="/assets/tontine_coin.png" alt="eth" width="34px" height="34px"/>
                </Box>
                <FormLabel htmlFor='amount' pl="45px">Tine</FormLabel>
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
              <FormControl mt={4} position="relative">
                <Box position="absolute" top="15%" transform="translateY(-50%)" zIndex="10">
                  <Image src="/assets/Ethereum.png" alt="eth" />
                </Box>
                <FormLabel htmlFor='readonly-amount' pl="45px">Price in Eth</FormLabel>
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
            </>
          )}
          footerContent={(
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
              isDisabled={
                !(tineAmountToBuy >= (smartContractMinLockAmount.toString() / 10 ** 18)) ||
                (tineAmountToBuy > (smartContractTokenBalance.toString() / 10 ** 18))
              }
            >
              Buy
            </Button>
          )}
        />
        {/* Modal pour lock de Tine */}
        <CustomModal
          isOpen={isLockOpen}
          onClose={onLockClose}
          headerContent="Lock Tine"
          bodyContent={(
            <>
            </>
          )}
          footerContent={(
            <Button colorScheme="blue" mr={3} onClick={() => {
              handleLockTine(onLockClose, setTineLockedDate, toast);
              onLockClose();
            }}>
              Lock
            </Button>
          )}
        />
        {/* Modal pour unlock de Tine */}
        <CustomModal
          isOpen={isUnlockOpen}
          onClose={onUnlockClose}
          headerContent="Unlock Tine"
          bodyContent={(
            <>
            </>
          )}
          footerContent={(
            <Button colorScheme="blue" mr={3} onClick={() => {
              handleUnlockTine(onUnlockClose, setTineLockedDate, toast);
              onUnlockClose();
            }}>
              Unlock
            </Button>
          )}
        />
        {/* Modal pour sell de Tine */}
        <CustomModal
          isOpen={isSellOpen}
          onClose={onSellClose}
          headerContent="Sell Tine"
          bodyContent={(
            <>
              <FormControl position="relative">
                <Box position="absolute" top="15%" left="5px" transform="translateY(-50%)" zIndex="10">
                  <Image src="/assets/tontine_coin.png" alt="eth" width="34px" height="34px"/>
                </Box>
                <FormLabel htmlFor='amount' pl="45px">Tine</FormLabel>
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
              <FormControl mt={4} position="relative">
                <Box position="absolute" top="15%" transform="translateY(-50%)" zIndex="10">
                  <Image src="/assets/Ethereum.png" alt="eth" />
                </Box>
                <FormLabel htmlFor='readonly-amount' pl="45px">Receive Eth</FormLabel>
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
            </>
          )}
          footerContent={(
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
          )}
        />
      </Box>
    </>
  );
};

export default TokenTineStack;
