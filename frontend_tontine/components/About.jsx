
import React, { useState, useEffect } from 'react';
import { Box, Flex, Image, Text, Link, Heading, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";

import { useTine } from "@/context/TineContext";
import UnconnectedWallet from "@/components/UnconnectedWallet";

const About = ({ isConnected }) => {
  const [clientIsConnected, setClientIsConnected] = useState(false);
  const { smartContractMinLockAmount, smartContractMinLockTime } = useTine();
  //Way to manage SSR Problems
  useEffect(() => {
    // Since isConnected is only true on the client-side after hydration,
    // set clientIsConnected based on isConnected when component mounts.
    setClientIsConnected(isConnected);
  }, [isConnected]); 
  
  return ( 
    <Flex className="hero-section-container" direction={{ base: "column", md: "row" }} color='#ffff'>
      <Box className="hero-info-wrapper" width="full">
        <Box className="hero-info-text">
          <Flex className='features-list-container' width='100%' justifyContent="center" alignItems="center" marginTop='20px'>        
            <Box className="card-container" width="100%">
              <Heading>Stake with us</Heading>
              <Box
                p="40px"
                color="white"
                mt="4"
                bg="teal.500"
                rounded="md"
                shadow="md"
                bgColor="#131330"
              >
                <Table variant="simple">
                  <Tbody>
                    <Tr>
                      <Td fontSize="lg">Tontine introduces a way to stake ETH in two distinct types of Vaults.</Td>
                    </Tr>
                    <Tr>
                      <Td borderBottom="none" fontSize="lg">The <span className="highlighted" color='#ffff'><Link href='/staking'>SilverVault</Link></span> in Tontine offers the simplest and most straightforward staking option.</Td>
                    </Tr>
                    <Tr>
                      <Td fontSize="lg">Participants can stake any amount of ETH they choose, with the flexibility to withdraw their assets at any time.</Td>
                    </Tr>
                    <Tr>
                      <Td borderBottom="none" fontSize="lg">The <span className="highlighted" color='#ffff'><Link href='/staking'>GoldVault</Link></span> in Tontine offers a superior yielding opportunity.</Td>
                    </Tr>
                    <Tr>
                      <Td borderBottom="none" fontSize="lg">To access the <span className="highlighted" color='#ffff'><Link href='/staking'>GoldVault</Link></span>, participants are required to purchase a minimum of {smartContractMinLockAmount.toString() / 10 ** 18} <span className="highlighted" color='#ffff'><Link href="/tokentine?modal=buy">Tine</Link></span>, the native coin of the dApp.</Td>
                    </Tr>
                    <Tr>
                      <Td borderBottom="none" fontSize="lg">By locking in their <span className="highlighted" color='#ffff'><Link href="/tokentine?modal=buy">Tine</Link></span>, participants unlock higher yield rates, thus multiplying the returns on their staked ETH.</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </Box>
            </Box>
          </Flex>
        </Box>
        {!clientIsConnected && <UnconnectedWallet />}
      </Box>
      <Box className="hero-image-container">
        <Image className="hero-img" src="/assets/hero.svg" alt="blockchain" />
      </Box>
    </Flex>
  );
};

export default About;
