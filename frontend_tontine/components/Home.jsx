import React, { useState, useEffect } from 'react';
import {
  Box, Flex, Text, Image, Input, Button, Link, Icon, useDisclosure,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Heading
} from "@chakra-ui/react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import CoingeckoServiceMock from "../services/api/EtherscanAPI"
// WAGMI
import { useAccount } from "wagmi";

const Home = () => {
  // Reprendre les infos du wallet connecté
  const { isConnected } = useAccount();

  const tontineChains = CoingeckoServiceMock.getTontineChains();
  const tontineTokenStake = CoingeckoServiceMock.getTontineTokenStake();
  const placeHolder = "Stake " + tontineTokenStake +  "+ tokens on " + tontineChains;

  const { isOpen: isDisclaimerOpen, onOpen: onDisclaimerOpen, onClose: onDisclaimerClose } = useDisclosure();

  useEffect(() => {
    if (!isConnected) {
      onDisclaimerOpen();
    }
  }, [isConnected, onDisclaimerOpen]);

  return (
    <>
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
      <Modal isOpen={isDisclaimerOpen} onClose={onDisclaimerClose} isCentered size="xl">
        <ModalOverlay />
        <ModalContent
            style={{
              padding: '20px',
              backgroundColor: '#131330',
              color: '#fff',
              borderRadius: '10px',
              border: 'double 1px transparent',
              backgroundClip: 'padding-box, border-box',
              backgroundOrigin: 'border-box',
              backgroundImage:
                'linear-gradient(#131330 0 0) padding-box, linear-gradient(to top left, transparent, #30bddc) border-box',
            }}
          >
          <ModalHeader textAlign="center" color="#fff">Tontine Disclaimer:</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Heading textAlign="center" color="#30bddc" as='h3' size='lg'>Acknowledgement of Terms & Conditions of access</Heading>
            <Text marginTop="20px" textAlign="center" as='h4' size='md'>
              Use of the Tontine is subject to the following terms and conditions and I hereby confirm that by proceeding and interacting with the protocol I am aware of these and accept them in full:
            </Text>
            <Text marginTop="20px" textAlign="center" as='h4' size='md'>
              Tontine is a smart contract protocol in alpha stage of launch, and even though multiple security audits have been completed on the smart contracts, I understand the risks associated with using the Tontine protocol and associated functions.
            </Text>
            <Text marginTop="20px" textAlign="center" as='h4' size='md'>
              Any interactions that I have with the associated Tontine protocol apps, smart contracts or any related functions MAY place my funds at risk, and I hereby release the Tontine protocol and its contributors, team members, and service providers from any and all liability associated with my use of the above-mentioned functions.
            </Text>
            <Text marginTop="20px" textAlign="center" as='h4' size='md'>
              I am lawfully permitted to access this site and use Tontine and I am not in contravention of any laws governing my jurisdiction of residence or citizenship.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={() => {
                onDisclaimerClose();
                // Optionally set a flag in local storage or context to remember the acceptance
              }}
            >
              I understand the risks involved, proceed to the app
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Home;
