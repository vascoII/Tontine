import { Flex, Box, Text } from '@chakra-ui/react';

const ConditionalActionButton = ({ buttons }) => {
  return (
    <Flex className='features-list-container' width='100%' justifyContent="center" alignItems="center" marginTop='50px'>
      {buttons.map((button, index) => (
        button.condition && (
          <Box key={index} className="card-container" onClick={button.onClick} textAlign="center">
            <Text>{button.text}</Text>
          </Box>
        )
      ))}
    </Flex>
  );
};

export default ConditionalActionButton;
