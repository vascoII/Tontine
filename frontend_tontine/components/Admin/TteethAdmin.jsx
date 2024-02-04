import React, { useState, useEffect } from 'react';

import { Box, Heading, Text, Collapse, Button } from "@chakra-ui/react";

const TteethAdmin = ({ isConnected, userAddress }) => {
  const [showContent, setShowContent] = useState(false);
  const handleToggle = () => setShowContent(!showContent);

  return (
    <>
      <Box
        className="card-container"
        p={4}
        w="full" 
        maxW="90%" 
        h="auto" 
        my={5} // Utilisez my pour la marge verticale
        mx="auto" // Utilisez mx pour la marge horizontale
      >
        <img src='./assets/wallet1.svg' alt="TtethAdmin" />
        <Heading
          onClick={handleToggle}
          cursor="pointer"
        >
          Tteth Smart contract Manager
        </Heading>
        <Collapse in={showContent} animateOpacity>
          <Box
            p="40px"
            mt="4"
            bg="teal.500"
            rounded="md"
            shadow="md"
            bgColor="#131330"
          >
            {/* Le contenu caché que vous voulez montrer quand on clique sur BLABLABLA */}
            <Text>Ce contenu est révélé par l'accordéon</Text>
          </Box>
        </Collapse>
      </Box>
    </>
  );
};

export default TteethAdmin;
