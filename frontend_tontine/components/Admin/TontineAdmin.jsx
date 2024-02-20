import React, { useState, useEffect } from 'react';

import { Box, Heading, Text, Collapse, Button } from "@chakra-ui/react";
import TontineStats from './Stats/TontineStats';

import { useChainId } from "wagmi";
import { getContractInfo } from "@/services/contracts/contractInfo";

const TontineAdmin = ({ isConnected, userAddress }) => {
  const [showContent, setShowContent] = useState(false);
  const handleToggle = () => setShowContent(!showContent);

  const chainId = useChainId();
  const {
    contractAddressTontine: contractAddressTontine,
    abiTontine: abiTontine,
  } = getContractInfo(chainId);

  return (
    <>
      <Box
        className="card-container"
        p={4}
        w="full" 
        maxW="95%" 
        h="auto" 
        my={5} // Utilisez my pour la marge verticale
        mx="auto" // Utilisez mx pour la marge horizontale
      >
        <img src='./assets/wallet1.svg' alt="TontineAdmin" />
        <Heading
          onClick={handleToggle}
          cursor="pointer"
        >
          Tontine Smart contract Manager
        </Heading>
        <Collapse in={showContent} animateOpacity>
          <Box
            p="40px"
            color="white"
            mt="4"
            bg="teal.500"
            rounded="md"
            shadow="md"
            bgColor="#131330"
          >
            <TontineStats/>
          </Box>
        </Collapse>
      </Box>
    </>
  );
};

export default TontineAdmin;
