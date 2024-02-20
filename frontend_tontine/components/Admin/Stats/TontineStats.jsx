import React, { useState, useEffect } from 'react';

import { useTontineStatistics } from '@/hooks/useTontineStatistics';
import { getContractInfo } from "@/services/contracts/contractInfo";

import { Box, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

import { useChainId } from "wagmi";

const TontineStats = ({ isConnected, userAddress }) => {
  const [clientIsConnected, setClientIsConnected] = useState(false);

  const {
    totalDepositsSilver,
    totalDepositsGold,
    totalDepositsCountSilver,
    totalDepositsCountGold,
    averageDepositsSilver,
    averageDepositsGold,
    totalWithdrawsSilver,
    totalWithdrawsGold,
    totalWithdrawsCountSilver,
    totalWithdrawsCountGold,
    averageWithdrawsSilver,
    averageWithdrawsGold
  } = useTontineStatistics();

  const chainId = useChainId();
  const {
    contractAddressTontine: contractAddressTontine,
    abiTontine: abiTontine,
  } = getContractInfo(chainId);

  //Way to manage SSR Problems
  useEffect(() => {
    // Since isConnected is only true on the client-side after hydration,
    // set clientIsConnected based on isConnected when component mounts.
    setClientIsConnected(isConnected);
  }, [isConnected]); 

  
  return (
    <Box>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Type</Th>
            <Th isNumeric>Deposit Total Amount</Th>
            <Th isNumeric>Deposit Transactions Count</Th>
            <Th isNumeric>Deposit Average Deposit</Th>
            <Th isNumeric>Withdraw Total Amount</Th>
            <Th isNumeric>Withdraw Transactions Count</Th>
            <Th isNumeric>Withdraw Average Deposit</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>Silver Vault</Td>
            <Td isNumeric>{totalDepositsSilver} ETH</Td>
            <Td isNumeric>{totalDepositsCountSilver}</Td>
            <Td isNumeric>{averageDepositsSilver} ETH</Td>
            <Td isNumeric>{totalWithdrawsSilver} ETH</Td>
            <Td isNumeric>{totalWithdrawsCountSilver}</Td>
            <Td isNumeric>{averageWithdrawsSilver} ETH</Td>
          </Tr>
          <Tr>
            <Td>Gold Vault</Td>
            <Td isNumeric>{totalDepositsGold} ETH</Td>
            <Td isNumeric>{totalDepositsCountGold}</Td>
            <Td isNumeric>{averageDepositsGold} ETH</Td>
            <Td isNumeric>{totalWithdrawsSilver} ETH</Td>
            <Td isNumeric>{totalWithdrawsCountSilver}</Td>
            <Td isNumeric>{averageWithdrawsSilver} ETH</Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
};

export default TontineStats;
