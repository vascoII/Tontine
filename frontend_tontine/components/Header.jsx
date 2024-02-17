"use client";

import React from 'react';
import { useState, useEffect } from "react";
import { Flex, Box, Link, Image, useToast } from '@chakra-ui/react';
import { LinkBox, LinkOverlay } from '@chakra-ui/react'
import NextLink from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from "wagmi";
import { useOwner } from "@/context/OwnerContext";

const Header = () => {
  const { isOwner } = useOwner(); // Utiliser le hook useOwner pour accéder à l'état isOwner

  return (
    <Flex className="header-container" align="center" justify="space-between" p="20px 40px">
      <LinkBox>
        <LinkOverlay href='/'>
          <Image
            borderRadius='full'
            boxSize='100px'
            src='./logo.png'
            alt='Tontine'
          />
        </LinkOverlay>
      </LinkBox>
      
      <Flex className="menu" justify="center" flex="1">
        <Link lineHeight='38px' fontWeight='600' fontSize='1.125rem' color='#ffff' margin='12px' href='/'>Home</Link>
        <Link lineHeight='38px' fontWeight='600' fontSize='1.125rem' color='#ffff' margin='12px' href='/staking'>Staking</Link>
        <Link lineHeight='38px' fontWeight='600' fontSize='1.125rem' color='#ffff' margin='12px' href='/tokentine'>Token Tine</Link>
        <Link lineHeight='38px' fontWeight='600' fontSize='1.125rem' color='#ffff' margin='12px' href='/about'>About</Link>
        {isOwner && <Link lineHeight='38px' fontWeight='600' fontSize='1.125rem' color='#ffff' margin='12px' href='/admin'>Admin</Link>}
      </Flex>
      <Box className="wallet-btn">
        <ConnectButton/>
      </Box>
    </Flex>
  );
};

export default Header;