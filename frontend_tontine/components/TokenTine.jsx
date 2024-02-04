import React from "react";
import { Box, Flex, Image, Text} from "@chakra-ui/react";

import TokenTineStackComponent from "@/components/TokenTine/TokenTineStack";

const TokenTine = ({ isConnected, userAddress }) => {

  return (
    <Flex className="hero-section-container" direction={{ base: "column", md: "row" }} color='#ffff'>
      <Box className="hero-info-wrapper">
        <Box className="hero-info-text">
          <Text fontWeight="bold" fontWeight='500' fontSize='3rem' color='#ffff'>
            <span className="highlighted">Token Tine</span>
          </Text>
          <TokenTineStackComponent userAddress={userAddress} isConnected={isConnected} />
        </Box>
      </Box>
      <Box className="hero-image-container">
        <Image className="hero-img" src="/assets/hero.svg" alt="blockchain" />
      </Box>
    </Flex>
  );
};

export default TokenTine;
