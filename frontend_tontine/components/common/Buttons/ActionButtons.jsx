import { Flex, Box, Text } from '@chakra-ui/react';

const ActionButtons = ({ buttons }) => {
  return (
    <Flex className='features-list-container' width='100%' justifyContent="space-between" alignItems="center" marginTop='50px'>
      {buttons.map((button, index) => (
        <Box key={index} className="card-container" onClick={button.onClick} width="100%" textAlign="center">
          <Text>{button.text}</Text>
        </Box>
      ))}
    </Flex>
  );
};

export default ActionButtons;
