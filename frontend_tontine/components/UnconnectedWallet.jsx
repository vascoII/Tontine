import React from 'react';
import { Flex, Box, Heading, Button, Text } from "@chakra-ui/react";
import { useConnectModal } from '@rainbow-me/rainbowkit';

const UnconnectedWallet = () => {
  const { openConnectModal } = useConnectModal();

  return (
    <Flex className='features-list-container' width='100%' justifyContent="space-between" alignItems="center" marginTop='50px'>
      <Box className="card-container" width="100%" textAlign="center">
        <Text>Connect your wallet and start your journey with Tontine</Text>
        <Button 
          onClick={() => openConnectModal()} 
          marginTop="20px" 
          bgColor="#3182CE" 
          color="#ffffff" 
          _hover={{ bg: "#4299E1" }}
        >
          Connect Wallet
        </Button>
      </Box>
    </Flex>
  );
};

export default UnconnectedWallet;