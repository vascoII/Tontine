"use client";

import React from 'react';
import { useState } from "react";
import { Box, Flex, Image, Text, Button} from "@chakra-ui/react";

import { useUser } from "@/context/UserContext";

import StakingEthPublic from "@/components/Staking/StakingEthPublic";
import StakingEthPrivate from "@/components/Staking/StakingEthPrivate";

const Staking = ({ isConnected, userAddress }) => {
  const { isUser } = useUser(); // Utiliser le hook useUser pour accéder à l'état isUser
  const [showPublic, setShowPublic] = useState(true); // État local pour gérer l'affichage

  const toggleView = () => {
    setShowPublic(!showPublic); // Inverser l'état d'affichage lorsqu'on appuie sur le bouton
  };

  return (
    <Flex className="hero-section-container" direction={{ base: "column", md: "row" }} color='#ffff'>
      <Box className="hero-info-wrapper" width="full">
        <Box className="hero-info-text">
          <Button
            className="toggle-option"
            bg={showPublic ? "#3182CE" : "transparent"} 
            color={showPublic ? "white" : "#3182CE"}
            onClick={() => setShowPublic(true)}
          >
            Public Vaults
          </Button>
          {isUser && isConnected && <Button
            className="toggle-option"
            bg={!showPublic ? "#3182CE" : "transparent"}
            color={!showPublic ? "white" : "#3182CE"}
            onClick={() => setShowPublic(false)}
          >
            Your deposits
          </Button>
          }
          {showPublic ? (
            <StakingEthPublic isConnected={isConnected} userAddress={userAddress} />
          ) : (
            <StakingEthPrivate isConnected={isConnected} userAddress={userAddress} setShowPublic/>
          )}
          
        </Box>
      </Box>
      <Box className="hero-image-container">
        <Image className="hero-img" src="/assets/hero.svg" alt="blockchain" />
      </Box>
    </Flex>
  );
};

export default Staking;
