import { Flex, Spinner, Text } from '@chakra-ui/react';

const CustomSpinner = () => {
  return (
    <Flex
      position="fixed" top="0" right="0"
      bottom="0" left="0" justifyContent="center"
      alignItems="center" zIndex="modal"
      backgroundColor='#131330' opacity='0.75'
    >
      <Flex flexDirection="column" alignItems="center">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
        <Text
          fontSize="xl"
          mt="4"
          color="white"
        >
          Transaction in progress, please wait...
        </Text>
      </Flex>
    </Flex>
  );
};

export default CustomSpinner;
