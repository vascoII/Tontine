import React from "react";
import { Box, Flex , Heading, Text} from "@chakra-ui/react";

const StakingConnected = ({userAddress}) => {

  return (
    <Flex p="2rem" width="100%" height="85vh" justifyContent="center" alignItems="center">
      <Heading>Staking connected</Heading>
    </Flex> 
  );
};

export default StakingConnected;
