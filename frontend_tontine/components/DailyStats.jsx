import React from "react";
import { Box, Text, Flex } from "@chakra-ui/react";
import CoingeckoServiceMock from "../services/api/CoingeckoServiceMock";

const tontineCurrentPrice = CoingeckoServiceMock.getTokenCurrentPrice('TINE', 'USD');
const ethCurrentPrice = CoingeckoServiceMock.getTokenCurrentPrice('ETH', 'USD');
const currentEthApy = CoingeckoServiceMock.getTokenCurrentAPY('ETH');
const currentTontineApy = CoingeckoServiceMock.getTokenCurrentAPY('TINE');

const DailyStats = () => {
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
        <Text fontSize="xl" className="metric-value" color='#ffff'>$100M</Text>
      </Box>
      <Box className="metric-container" textAlign="center" m={2}>
        <Text fontSize="lg" fontWeight="bold" className="metric-title">Current Basic Staking APY</Text>
        <Text fontSize="xl" className="metric-value" color='#ffff'>{currentEthApy} %</Text>
      </Box>
      <Box className="metric-container" textAlign="center" m={2}>
        <Text fontSize="lg" fontWeight="bold" className="metric-title">Current Tontine Staking APY</Text>
        <Text fontSize="xl" className="metric-value" color='#ffff'>{currentTontineApy} %</Text>
      </Box>
    </Flex>
  );
};

export default DailyStats;
