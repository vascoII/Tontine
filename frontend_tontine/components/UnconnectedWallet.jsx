import { Flex, Box, Heading, Text } from "@chakra-ui/react";

const UnconnectedWallet = (width) => {
  return (
    <Flex className='features-list-container' width='100%' justifyContent="center" alignItems="center" marginTop='20px'>
      <Box className="card-container" width="100%">
        <img src='./assets/wallet1.svg' alt="Balance" />
        <Heading>Connect your wallet and start your journey with Tontine</Heading>
        <Text fontSize="xl" className="metric-value" color='#ffff' textAlign='right'></Text>
      </Box>
    </Flex>
  );
};

export default UnconnectedWallet;