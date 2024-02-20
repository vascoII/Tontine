import React, { useState, useEffect } from 'react';

import {
  Flex, Box, Text, useToast, Tooltip
} from "@chakra-ui/react";
import { InfoOutlineIcon } from '@chakra-ui/icons';

import { getTokenCurrentPrice } from "@/services/api/EtherscanAPI";
import { getTokenCurrentMaticPrice, getTineMaticRatio } from "@/services/api/PolygonscanAPI";

import { useTontine } from "@/context/TontineContext";
import { useTine } from "@/context/TineContext";

import { useChainId } from "wagmi";

const DailyStats = () => {
  const { silverVaultData,
    goldVaultData,
    rpSimpleAPR,
    rpNodeAPR
  } = useTontine();

  const { smartContractEthBalance } = useTine();
  const smartContractEthBalanceBigInt = BigInt(smartContractEthBalance);
  const silverLockedBigInt = BigInt(silverVaultData.ethLocked);
  const goldLockedBigInt = BigInt(goldVaultData.ethLocked);
  const totalLiquidity = smartContractEthBalanceBigInt + silverLockedBigInt + goldLockedBigInt;

  const [tontineCurrentPrice, setTontineCurrentPrice] = useState(0);
  const [ethCurrentPrice, setEthCurrentPrice] = useState(0);
  const [maticCurrentPrice, setMaticCurrentPrice] = useState(0);
  const [nativeCoin, setNativeCoin] = useState();

  const chainId = useChainId();

  const toast = useToast();

  useEffect(() => {
    async function fetchPrices() {
      try {
        const maticPrice = await getTokenCurrentMaticPrice('MATIC', 'USD');
        setMaticCurrentPrice(maticPrice);

        const ethPrice = await getTokenCurrentPrice('ETH', 'USD');
        setEthCurrentPrice(ethPrice);

        if (chainId == 80001) {
          setTontineCurrentPrice(maticPrice);
          setNativeCoin('Matic');
        } else {
          setTontineCurrentPrice(ethPrice / 10);
          setNativeCoin('Eth');
        }
      } catch (err) {
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
  }, [chainId]);

  return (
    <Flex
      className="daily-stats-container gradient-border"
      wrap="wrap"
      justify="center"
      align="center"
      p={4}
      w="full"
      maxW="98%"
      h="auto" 
      my="auto" 
      mx="auto"
      marginTop='5'
    >
      <Box className="metric-container" textAlign="center" m={2}>
        <Text fontSize="lg" fontWeight="bold" className="metric-title">Tine Price (usd)</Text>
        <Text fontSize="xl" className="metric-value" color='#ffff'>{tontineCurrentPrice}</Text>
      </Box>
      <Box className="metric-container" textAlign="center" m={2}>
        <Text fontSize="lg" fontWeight="bold" className="metric-title">Matic Price (usd)</Text>
        <Text fontSize="xl" className="metric-value" color='#ffff'>{maticCurrentPrice}</Text>
      </Box>
      <Box className="metric-container" textAlign="center" m={2}>
        <Text fontSize="lg" fontWeight="bold" className="metric-title">Ether Price (usd)</Text>
        <Text fontSize="xl" className="metric-value" color='#ffff'>{ethCurrentPrice}</Text>
      </Box>
      <Box className="metric-container" textAlign="center" m={2}>
        <Text fontSize="lg" fontWeight="bold" className="metric-title">Chains Supported</Text>
        <Text fontSize="xl" className="metric-value" color='#ffff'>Eth / Polygon</Text>
      </Box>
      <Box className="metric-container" textAlign="center" m={2}>
        <Text fontSize="lg" fontWeight="bold" className="metric-title">Total Liquidity ({ nativeCoin })</Text>
        <Text fontSize="xl" className="metric-value" color='#ffff'>{ totalLiquidity.toString() / 10 ** 18 }</Text>
      </Box>
      <Box className="metric-container" textAlign="center" m={2}>
        <Text fontSize="lg" fontWeight="bold" className="metric-title">
          Silver Vault Average Return
          <Tooltip
            label="APR is calculated using a 7 day average"
            fontSize="md"
            backgroundColor="#131330"
            borderRadius="10px"
            border="double 1px transparent"
            backgroundClip="padding-box, border-box"
            backgroundOrigin="border-box"
          >
            <InfoOutlineIcon cursor="pointer" ml={2}/>
          </Tooltip>
        </Text>
        <Text fontSize="xl" className="metric-value" color='#ffff'>{rpSimpleAPR}%</Text>
      </Box>
      <Box className="metric-container" textAlign="center" m={2}>
        <Text fontSize="lg" fontWeight="bold" className="metric-title">
          Gold Vault Average Return
          <Tooltip
            label="APR is calculated using a 7 day average"
            fontSize="md"
            backgroundColor="#131330"
            borderRadius="10px"
            border="double 1px transparent"
            backgroundClip="padding-box, border-box"
            backgroundOrigin="border-box"
          >
            <InfoOutlineIcon cursor="pointer" ml={2}/>
          </Tooltip>
        </Text>
        <Text fontSize="xl" className="metric-value" color='#ffff'>{rpNodeAPR}%</Text>
      </Box>
    </Flex>
  );
};

export default DailyStats;
