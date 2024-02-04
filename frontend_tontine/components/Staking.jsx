import React from "react";
import { Box, Flex, Image, Text} from "@chakra-ui/react";

import { useUser } from "@/context/UserContext";

import StakingConnected from "@/components/Staking/StakingConnected";
import StakingUnconnected from "@/components/Staking/StakingUnconnected";

const Staking = ({ isConnected, userAddress }) => {
  const { isUser } = useUser(); // Utiliser le hook useUser pour accéder à l'état isUser

  return (
    <Flex className="hero-section-container" direction={{ base: "column", md: "row" }} color='#ffff'>
      <Box className="hero-info-wrapper">
        <Box className="hero-info-text">
          <Text fontWeight="bold" fontWeight='500' fontSize='3rem' color='#ffff'>
            <span className="highlighted">Staking</span>
          </Text>
          
        </Box>
      </Box>
      <Box className="hero-image-container">
        <Image className="hero-img" src="/assets/hero.svg" alt="blockchain" />
      </Box>
    </Flex>
  );
};

export default Staking;
