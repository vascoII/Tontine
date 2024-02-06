import React, { useState, useEffect } from 'react';

import {
  Flex, Box, Text, useToast
} from "@chakra-ui/react";

import { getTokenCurrentPrice } from "@/services/api/EtherscanAPI";

import { useTontine } from "@/context/TontineContext";
import { useTine } from "@/context/TineContext";

const DailyStats = () => {
  const { silverVaultData,
    goldVaultData,
  } = useTontine();

  const { smartContractEthBalance } = useTine();
  const smartContractEthBalanceBigInt = BigInt(smartContractEthBalance);
  const silverLockedBigInt = BigInt(silverVaultData.ethLocked);
  const goldLockedBigInt = BigInt(goldVaultData.ethLocked);
  const totalLiquidity = smartContractEthBalanceBigInt + silverLockedBigInt + goldLockedBigInt;

  const [tontineCurrentPrice, setTontineCurrentPrice] = useState(0);
  const [ethCurrentPrice, setEthCurrentPrice] = useState(0);

  const toast = useToast();

  useEffect(() => {
    async function fetchPrices() {
      try {
        const tontinePrice = await getTokenCurrentPrice('TINE', 'USD');
        const ethPrice = await getTokenCurrentPrice('ETH', 'USD');
        
        setTontineCurrentPrice(Math.round(tontinePrice));
        setEthCurrentPrice(Math.round(ethPrice));
      } catch (err) {console.log(err.message)
        toast({
          title: "Error!",
          description: "Error on prices fetching.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }

    // Appeler la fonction pour obtenir les prix actuels
    fetchPrices();
  }, []);

  return (
    <Flex
      className="daily-stats-container gradient-border"
      wrap="wrap"
      justify="center"
      align="center" 
      p={4}
      w="full" 
      maxW="90%" 
      h="auto" 
      my="auto" 
      mx="auto"
      marginTop='5'
    >
      <Box className="metric-container" textAlign="center" m={2}>
        <Text fontSize="lg" fontWeight="bold" className="metric-title">Tine Price</Text>
        <Text fontSize="xl" className="metric-value" color='#ffff'>{tontineCurrentPrice} USD</Text>
      </Box>
      <Box className="metric-container" textAlign="center" m={2}>
        <Text fontSize="lg" fontWeight="bold" className="metric-title">Ether Price</Text>
        <Text fontSize="xl" className="metric-value" color='#ffff'>{ethCurrentPrice} USD</Text>
      </Box>
      <Box className="metric-container" textAlign="center" m={2}>
        <Text fontSize="lg" fontWeight="bold" className="metric-title">Chains Supported</Text>
        <Text fontSize="xl" className="metric-value" color='#ffff'>Etherum</Text>
      </Box>
      <Box className="metric-container" textAlign="center" m={2}>
        <Text fontSize="lg" fontWeight="bold" className="metric-title">Total Liquidity</Text>
        <Text fontSize="xl" className="metric-value" color='#ffff'>{ totalLiquidity.toString() / 10 ** 18 }Eth</Text>
      </Box>
      <Box className="metric-container" textAlign="center" m={2}>
        <Text fontSize="lg" fontWeight="bold" className="metric-title">Current Silver Vault APR</Text>
        <Text fontSize="xl" className="metric-value" color='#ffff'>{silverVaultData.apr }%</Text>
      </Box>
      <Box className="metric-container" textAlign="center" m={2}>
        <Text fontSize="lg" fontWeight="bold" className="metric-title">Current Gold Vault APR</Text>
        <Text fontSize="xl" className="metric-value" color='#ffff'>{goldVaultData.apr }%</Text>
      </Box>
    </Flex>
  );
};

export default DailyStats;
