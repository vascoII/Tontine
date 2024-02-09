import React, { useState, useEffect } from 'react';

import {
  Flex, Box, Text, useToast, Heading, Table, Thead, Tbody, Tr, Th, Td
} from "@chakra-ui/react";

import {
  getSilverVaultDepositsByUser,
  getSilverVaultWithdrawsByUser,
  getGoldVaultDepositsByUser,
  getGoldVaultWithdrawsByUser
} from "@/services/contracts/users/tontineServices";

const StakingEthPrivate = ({ isConnected, userAddress }) => {  
  const [clientIsConnected, setClientIsConnected] = useState(false);
  const [silverVaultOperation, setSilverVaultOperation] = useState([]);
  const [goldVaultOperation, setGoldVaultOperation] = useState([]); 
  const [silverBalance, setSilverBalance] = useState(0);
  const [goldBalance, setGoldBalance] = useState(0); 

  const toast = useToast();

  // Fonction pour formater une date en YYYY-mm-dd
  const formatDate = (timestamp) => {
    const date = new Date(Number(timestamp) * 1000); // Convertir le timestamp en millisecondes
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ajouter un 0 devant si le mois est < 10
    const day = String(date.getDate()).padStart(2, '0'); // Ajouter un 0 devant si le jour est < 10
    return `${year}-${month}-${day}`;
  };

  //Way to manage SSR Problems
  useEffect(() => {
    // Since isConnected is only true on the client-side after hydration,
    // set clientIsConnected based on isConnected when component mounts.
    setClientIsConnected(isConnected);
  }, [isConnected]); 

  useEffect(() => {
    if (isConnected) {
      fetchUserSilverVaultData();
      fetchUserGoldVaultData();
    }
  }, [isConnected, userAddress]);

  const fetchUserSilverVaultData = async () => {
    try {
      const userSilverDeposits = await getSilverVaultDepositsByUser(userAddress); 
      const userSilverWithdraws = await getSilverVaultWithdrawsByUser(userAddress); 
      // Fusionner les dépôts et les retraits en ajoutant une indication de la nature de chaque transaction
      const allSilverTransactions = [];
      let balance = 0;
      userSilverDeposits.forEach(deposit => {
        allSilverTransactions.push({
            date: deposit.timeDeposited,
            deposits: deposit.amount,
            withdraws: 0, // Il s'agit d'un dépôt, donc le montant de retrait est de 0
        });
        // Calcul du solde  
        balance += Number(deposit.amount);
      });
      userSilverWithdraws.forEach(withdraw => {
        allSilverTransactions.push({
            date: withdraw.timeDeposited,
            deposits: 0, // Il s'agit d'un retrait, donc le montant de dépôt est de 0
            withdraws: withdraw.amount,
        });
        // Calcul du solde
        balance -= Number(withdraw.amount);
      });
      // Triez la liste par date
      const sortedSilverTransactions = allSilverTransactions.sort((a, b) => a.date - b.date);
      //Set Balance
      setSilverBalance(balance);
      //Set operations
      setSilverVaultOperation(sortedSilverTransactions);
    } catch (err) {
      console.log(err.message);
      toast({
          title: "Error!",
          description: "An error occured on fetching silver vault operation.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
    }
  };

  const fetchUserGoldVaultData = async () => {
    try {
      const userGoldDeposits = await getGoldVaultDepositsByUser(userAddress); 
      const userGoldWithdraws = await getGoldVaultWithdrawsByUser(userAddress); 
      // Fusionner les dépôts et les retraits en ajoutant une indication de la nature de chaque transaction
      const allGoldTransactions = [];
      let balance = 0;
      userGoldDeposits.forEach(deposit => {
        allGoldTransactions.push({
            date: deposit.timeDeposited,
            deposits: deposit.amount,
            withdraws: null, // Il s'agit d'un dépôt, donc le montant de retrait est de 0
        });
        // Calcul du solde  
        balance += Number(deposit.amount);
      });
      userGoldWithdraws.forEach(withdraw => {
        allGoldTransactions.push({
            date: withdraw.timeDeposited,
            deposits: null, // Il s'agit d'un retrait, donc le montant de dépôt est de 0
            withdraws: withdraw.amount,
        });
        // Calcul du solde
        balance -= Number(withdraw.amount);
      });
      // Triez la liste par date
      const sortedGoldTransactions = allGoldTransactions.sort((a, b) => a.date - b.date);
      //Set Balance
      setGoldBalance(balance);
      //Set operations
      setGoldVaultOperation(sortedGoldTransactions);
    } catch (err) {
      toast({
          title: "Error!",
          description: "An error occured on fetching gold vault operation.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
    }
  };
  

  return (
    <>
      <Flex className='features-list-container' width='100%' justifyContent="center" alignItems="center" marginTop='20px'>
        {clientIsConnected && 
          <>
            <Box className="card-container" width="100%">
              <img src='./assets/profit1.svg' alt="Balance" />
              <Heading>Silver Vault</Heading>
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
                  {silverVaultOperation.map(transaction => (
                    <Tr key={transaction.date}>
                      <Th textAlign="center">{formatDate(transaction.date)}</Th>
                      <Th textAlign="right">
                        {transaction.deposits !== null ? (transaction.deposits.toString() / 10 ** 18) : ""}
                      </Th>
                      <Th textAlign="right">
                        {transaction.withdraws !== null ? (transaction.withdraws.toString() / 10 ** 18) : ""}
                      </Th>
                      <Th/>
                    </Tr>
                  ))}
                  <Tr>
                    <Th/>
                    <Th/>
                    <Th/>
                    <Th textAlign="right">{silverBalance.toString() / 10 ** 18} Eth</Th>
                  </Tr>
                </Tbody>
              </Table>
            </Box>
            <Box className="card-container" width="100%">
              <img src='./assets/profit1.svg' alt="Balance" />
              <Heading>Gold Vault</Heading>
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
                  {goldVaultOperation.map(transaction => (
                    <Tr key={transaction.date}>
                      <Th textAlign="center">{formatDate(transaction.date)}</Th>
                      <Th textAlign="right">
                        {transaction.deposits !== null ? (transaction.deposits.toString() / 10 ** 18) : ""}
                      </Th>
                      <Th textAlign="right">
                        {transaction.withdraws !== null ? (transaction.withdraws.toString() / 10 ** 18) : ""}
                      </Th>
                      <Th/>
                    </Tr>
                  ))}
                  <Tr>
                    <Th/>
                    <Th/>
                    <Th/>
                    <Th textAlign="right">{goldBalance.toString() / 10 ** 18} Eth</Th>
                  </Tr>
                </Tbody>
              </Table>
            </Box>
          </>
        }
      </Flex>
    </>
  );

};

export default StakingEthPrivate;
