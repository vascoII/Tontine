import React, { useState, useEffect } from 'react';

import { useRouter } from 'next/router';

import {
  Flex, Box, Text, useDisclosure, Button,
  FormControl, FormLabel, Input,
  useToast, Heading, Image
} from "@chakra-ui/react";

import { useChainId } from "wagmi";
import { getContractInfo } from "@/services/contracts/contractInfo";

import { getTineEthRatio } from "@/services/api/EtherscanAPI";
import { getTineMaticRatio } from "@/services/api/PolygonscanAPI";

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
import ConditionalActionButton from "@/components/common/Buttons/ConditionalActionButton";
import InfoCard from "@/components/common/Card/InfoCard";
import CustomSpinner from "@/components/common/CustomSpinner";

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
  const [isLoading, setIsLoading] = useState(false);

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
  const [tineNativeTokenRatio, setTineNativeTokenRatio] = useState(0);
  const [nativetokenCost, setNativeTokenCost] = useState(0);
  const [nativetokenValue, setNativeTokenValue] = useState(0);

  const chainId = useChainId();
  const {
    contractAddressTine: contractAddressTine,
    abiTine: abiTine,
  } = getContractInfo(chainId);

  const toast = useToast();

  const assetPath = chainId == 80001 ? "/assets/iconMatic.png" : "/assets/iconEth.png";
  const assetName = chainId == 80001 ? "Matic" : "Eth";

  //Way to manage SSR Problems
  useEffect(() => {
    // Since isConnected is only true on the client-side after hydration,
    // set clientIsConnected based on isConnected when component mounts.
    setClientIsConnected(isConnected);
  }, [isConnected]); 

  useEffect(() => {
    const fetchRatio = async () => {
      const ratio = chainId == 80001 ? await getTineMaticRatio() : await getTineEthRatio();
      if (ratio) {
        setTineNativeTokenRatio(ratio);
      }
    };

    fetchRatio();
  }, [chainId]);

  useEffect(() => {
    const costInNativeToken = parseFloat(tineAmountToBuy) * tineNativeTokenRatio;
    setNativeTokenCost(costInNativeToken);
  }, [tineAmountToBuy, tineNativeTokenRatio, chainId]);

  useEffect(() => {
    const valueInNativeToken = parseFloat(tineAmountToSell) * tineNativeTokenRatio;
    setNativeTokenValue(valueInNativeToken);
  }, [tineAmountToSell, tineNativeTokenRatio, chainId]);

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
        thus multiplying the returns on your staked {assetName}.
      </Text>
      
      {clientIsConnected ? (
        <Flex className='features-list-container' width='100%' justifyContent="center" alignItems="center" marginTop='20px'>
          <InfoCard
            imageSrc='./assets/profit1.svg'
            altText='Balance'
            heading='Your current Tine balance'
            contentArray={[`${tineUserBalance.toString()} TINE`]}
          />

          <InfoCard
            imageSrc='./assets/insurance1.svg'
            altText='Lock'
            heading='Lock Date started'
            contentArray={[userTineLockedDate.toString()]}
          />
        </Flex>
      ) : (
        <UnconnectedWallet/>
      )}
      
      {clientIsConnected &&
        <ConditionalActionButton
          buttons={[
            { onClick: onBuyOpen, text: "Buy Tine", condition: true },
            { onClick: onLockOpen, text: "Lock Tine", condition: tineUserBalance >= 1 && userTineLockedDate == '' },
            { onClick: onUnlockOpen, text: "Unlock Tine", condition: userTineLockedDate != '' },
            { onClick: onSellOpen, text: "Sell Tine", condition: tineUserBalance > 0 },
          ]}
        />
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
                  <Image src="/assets/tontine_coin.png" alt="eth" borderRadius='full' boxSize='30px' marginLeft='1px'/>
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
                  <Image src={assetPath} alt="eth" borderRadius='full' boxSize='30px' marginLeft='5px'/>
                </Box>
                <FormLabel htmlFor='readonly-amount' pl="45px">Price in {assetName}</FormLabel>
                <Input
                  id='readonly-amount'
                  type='number'
                  value={nativetokenCost.toFixed(2)}
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
                  nativetokenCost.toFixed(2),
                  onBuyClose,
                  handleActionDone,
                  setTineUserBalance,
                  toast,
                  tineUserBalance, 
                  setIsLoading,
                  contractAddressTine,
                  abiTine
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
              handleLockTine(
                onLockClose,
                setTineLockedDate,
                toast,  
                setIsLoading,
                contractAddressTine,
                abiTine
              );
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
              handleUnlockTine(
                onUnlockClose,
                setTineLockedDate,
                toast, 
                setIsLoading,
                contractAddressTine,
                abiTine
              );
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
                  <Image src="/assets/tontine_coin.png" alt="eth" borderRadius='full' boxSize='30px' marginLeft='1px'/>
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
                  <Image src={assetPath} alt="eth" borderRadius='full' boxSize='30px' marginLeft='5px'/>
                </Box>
                <FormLabel htmlFor='readonly-amount' pl="45px">Receive {assetName}</FormLabel>
                <Input
                  id='readonly-amount'
                  type='number'
                  value={nativetokenValue.toFixed(2)}
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
                    tineUserBalance, 
                    setIsLoading,
                    contractAddressTine,
                    abiTine
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
      {isLoading && <CustomSpinner/>}
    </>
  );
};

export default TokenTineStack;
