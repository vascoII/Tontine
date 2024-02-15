// components/common/VaultTable.jsx
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Text } from '@chakra-ui/react';
import { formatDate } from '@/services/utils/dateUtils';

const VaultTable = ({ vaultType, vaultOperations, balance, interest }) => {
  return (
    <Box className="card-container" width="100%">
      <img src="./assets/profit1.svg" alt={vaultType} />
      <Heading>{`${vaultType} Vault`}</Heading>
      <Table>
        <Thead>
          <Tr>
            <Th textAlign="center">Date</Th>
            <Th textAlign="right">Deposits</Th>
            <Th textAlign="right">Withdraws</Th>
            <Th textAlign="right">Balance</Th>
          </Tr>
        </Thead>
        <Tbody>
          {vaultOperations.map((transaction, index) => (
            <Tr key={index}>
              <Td textAlign="center">{formatDate(transaction.date)}</Td>
              <Td textAlign="right">
                {transaction.deposits !== null ? (transaction.deposits.toString() / 10 ** 18) : ""}
              </Td>
              <Td textAlign="right">
                {transaction.withdraws !== null ? (transaction.withdraws.toString() / 10 ** 18) : ""}
              </Td>
              <Td />
            </Tr>
          ))}
          <Tr>
            <Td />
            <Td />
            <Td />
            <Td textAlign="right">{(balance.toString() / 10 ** 18) + ' Eth'}</Td>
          </Tr>
          <Tr>
            <Td colSpan={4} textAlign="right">
              {'Interests made: ' + (interest.toString() / 10 ** 18) + ' Eth'}
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
};

export default VaultTable;
