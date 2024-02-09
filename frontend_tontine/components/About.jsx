
import React, { useState, useEffect } from 'react';
import { Box, Flex, Image, Text, Link} from "@chakra-ui/react";

import { useTine } from "@/context/TineContext";

const About = ({ isConnected, userAddress }) => {
  const { smartContractMinLockAmount,
    smartContractMinLockTime,
  } = useTine();
  
  return (
    <Flex className="hero-section-container" direction={{ base: "column", md: "row" }} color='#ffff'>
      <Box className="hero-info-wrapper">
        <Box className="hero-info-text" width='90%'>
          <Text fontSize="5xl" fontWeight="bold" fontWeight='700' fontSize='5rem' lineHeight='95px' color='#ffff'>
            The <span className="highlighted">Tontine</span> Staking
          </Text>
          <Text className="hero-info-description" fontSize='1.5rem' marginBottom='10px' marginTop='20px'>
            Tontine introduces an innovative way to stake ETH in two distinct types of Vaults.
          </Text>
          <Flex className="search-container" align="center" />
          
          <Text className="hero-info-description" fontSize='1.5rem' marginBottom='10px' marginTop='50px'>
            The <span className="highlighted" color='#ffff'><Link href='/staking'>SilverVault</Link></span> in Tontine offers the simplest and most straightforward staking option. 
          </Text>
          <Text className="hero-info-description" fontSize='1.5rem' marginBottom='10px'>
            Participants can stake any amount of ETH they choose, with the flexibility to withdraw their assets at any time. 
          </Text>
          
          <Flex className="search-container" align="center" />
          
          <Text className="hero-info-description" fontSize='1.5rem' marginBottom='10px' marginTop='50px'>
             Tontine's <span className="highlighted" color='#ffff'><Link href='/staking'>GoldVault</Link></span> presents a superior yielding opportunity. 
          </Text>
          <Text className="hero-info-description" fontSize='1.5rem' marginBottom='10px'>
             To access the <span className="highlighted" color='#ffff'><Link href='/staking'>GoldVault</Link></span>, participants are required to purchase a minimum of {smartContractMinLockAmount.toString() / 10 ** 18} <span className="highlighted" color='#ffff'><Link href="/tokentine?modal=buy">Tine</Link></span>, the native coin of the dApp.
          </Text>
          <Text className="hero-info-description" fontSize='1.5rem' marginBottom='10px'>
             By locking in their <span className="highlighted" color='#ffff'><Link href="/tokentine?modal=buy">Tine</Link></span>, participants unlock higher yield rates, thus multiplying the returns on their staked ETH.
          </Text>
          <Flex className="search-container" align="center"/>
            
        </Box>
      </Box>
      <Box className="hero-image-container">
        <Image className="hero-img" src="/assets/hero.svg" alt="blockchain" />
      </Box>
    </Flex>
  );
};

export default About;
