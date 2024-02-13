import React from "react";
import { Box, Flex, Image, Text} from "@chakra-ui/react";

import { useOwner } from "@/context/OwnerContext";

import TokenTineAdmin from "@/components/Admin/TokenTineAdmin";
import TontineAdmin from "@/components/Admin/TontineAdmin";

const Admin = ({ isConnected, userAddress }) => {
  const { isOwner } = useOwner(); // Utiliser le hook useOwner pour accéder à l'état isOwner

  return (
    <Flex className="hero-section-container"
      direction="column" // Cela empile les enfants verticalement
      align="center" // Cela centre les enfants horizontalement
      width="full"
      color='#ffff'>
      { isOwner && <TokenTineAdmin userAddress={userAddress} isConnected={isConnected} />}
      { isOwner && <TontineAdmin userAddress={userAddress} isConnected={isConnected} />}
    </Flex>
  );
};

export default Admin;
