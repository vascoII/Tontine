import React from "react";
import { Box, Text } from "@chakra-ui/react";

const Footer = () => {
  return (
    <Box className="footer-container" w="full" color="white" p={4} textAlign="center" marginTop='2'>
      <Text fontSize="sm" className="footer-copyright"  fontSize='1.5rem'>
        All rights reserved &copy; Tontine - VascoII {new Date().getFullYear()}
      </Text>
    </Box>
  );
};

export default Footer;
