import React from "react";
import { Box, Flex, Text, Image, Input, Button, Link, Icon } from "@chakra-ui/react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import CoingeckoServiceMock from "../services/api/CoingeckoServiceMock"
// WAGMI
import { useAccount } from "wagmi";

const Home = () => {
  // Reprendre les infos du wallet connecté
  const { isConnected } = useAccount();

  const tontineChains = CoingeckoServiceMock.getTontineChains();
  const tontineTokenStake = CoingeckoServiceMock.getTontineTokenStake();
  const placeHolder = "Stake " + tontineTokenStake +  "+ tokens on " + tontineChains;

  return (
    <Flex className="hero-section-container" direction={{ base: "column", md: "row" }} color='#ffff'>
      <Box className="hero-info-wrapper">
        <Box className="hero-info-text" width='90%'>
          <Text fontSize="5xl" fontWeight="bold" fontWeight='700' fontSize='5rem' lineHeight='95px' color='#ffff'>
            The <span className="highlighted">Decentralized</span> Staking Protocol
          </Text>
          <Text className="hero-info-description" fontSize='1.5rem' marginBottom='10px'>
            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
          </Text>
        </Box>
      </Box>
      <Box className="hero-image-container">
        <Image className="hero-img" src="/assets/hero.svg" alt="blockchain" />
      </Box>
    </Flex>
  );
};

export default Home;
