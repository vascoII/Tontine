// components/common/InfoCard.jsx

import { Box, Flex, Heading, Text, Image } from '@chakra-ui/react';

const InfoCard = ({ imageSrc, altText, heading, contentArray }) => {
  return (
    <Box className="card-container" width="100%">
      <Image src={imageSrc} alt={altText} />
      <Heading>{heading}</Heading>
      {contentArray.map((content, index) => (
        <Text key={index} textAlign='right'>{content}</Text>
      ))}
    </Box>
  );
};

export default InfoCard;
