import React, { useState, useEffect } from 'react';

import {
  Flex, Box, Text, useToast, Heading, Table, Thead, Tbody, Tr, Th, Td
} from "@chakra-ui/react";
import {
  useDisclosure, Button, FormControl, 
  FormLabel, Input, Link
} from "@chakra-ui/react";

import { formatDate } from "@/services/utils/dateUtils";

import { handleUnstakeOnSilverVault, handleUnstakeOnGoldVault } from "@/services/internal/handle/stakingEthHandleService";
import { fetchUserSilverVaultData, fetchUserGoldVaultData } from "@/services/internal/fetch/stakingEthFetchService";

import CustomModal from "@/components/common/Modal/CustomModal";
import ActionButtons from "@/components/common/Buttons/ActionButtons";

const StakingEthPrivate = ({ isConnected, userAddress }) => {  
  const [clientIsConnected, setClientIsConnected] = useState(false);
  const [silverVaultOperation, setSilverVaultOperation] = useState([]);
  const [goldVaultOperation, setGoldVaultOperation] = useState([]); 
  const [silverBalance, setSilverBalance] = useState(0n);
  const [goldBalance, setGoldBalance] = useState(0n); 

  const { isOpen: isSilverOpen, onOpen: onSilverOpen, onClose: onSilverClose } = useDisclosure();
  const { isOpen: isGoldOpen, onOpen: onGoldOpen, onClose: onGoldClose } = useDisclosure();

  const [isWarningOpen, setWarningOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState();
  const [ethSilverAmount, setEthSilverAmount] = useState(0);
  const [ethGoldAmount, setEthGoldAmount] = useState(0); 
  
  const toast = useToast();

  //Way to manage SSR Problems
  useEffect(() => {
    // Since isConnected is only true on the client-side after hydration,
    // set clientIsConnected based on isConnected when component mounts.
    setClientIsConnected(isConnected);
  }, [isConnected]); 

  useEffect(() => {
    if (isConnected) {
      fetchUserSilverVaultData(userAddress, setSilverBalance, setSilverVaultOperation, toast);
      fetchUserGoldVaultData(userAddress, setGoldBalance, setGoldVaultOperation, toast);
    }
  }, [isConnected, userAddress]);

  /************ UNSTAKING *****************/
  const handleGoldButtonClick = () => {
    if (goldBalance > 0) {
      onGoldOpen(); // Ouvre la modal de staking
    } else {
      setWarningMessage(true);
      setWarningOpen(true); // Ouvre la modal d'avertissement
    }
  };

  const handleSilverButtonClick = () => {
    if (silverBalance > 0) {
      onSilverOpen(); // Ouvre la modal de staking
    } else {
      setWarningMessage(false);
      setWarningOpen(true); // Ouvre la modal d'avertissement
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
                    <Tr key={transaction.key}>
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
                    <Tr key={transaction.key}>
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
      {clientIsConnected && 
        <ActionButtons
          buttons={[
            { onClick: handleSilverButtonClick, text: "Unstake Eth on Silver Vault" },
            { onClick: handleGoldButtonClick, text: "Unstake Eth on Gold Vault" },
            // Add more buttons as needed
          ]}
        />
      }

      <Box>
        {/* Modal pour unstake on silver vault */}
        <CustomModal
          isOpen={isSilverOpen}
          onClose={onSilverClose}
          headerContent="Unstake Eth on Silver Vault"
          bodyContent={(
            <>
              <FormControl>
                <FormLabel htmlFor='amount'>Unstake ETH</FormLabel>
                <Input
                  id='amount'
                  type='number'
                  value={ethSilverAmount}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (!isNaN(value) && value > 0) {
                      setEthSilverAmount(value);
                    } else {
                      setEthSilverAmount('');
                    }
                  }}
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.16)',
                  }}
                />
                <Text fontSize="sm" color="gray.400" mt={2}>
                  Max withdraw {silverBalance.toString() / 10 ** 18} ETH
                </Text>
              </FormControl>
              <FormControl mt={4}>
                <FormLabel htmlFor='readonly-amount'>Receive Eth</FormLabel>
                <Input
                  id='readonly-amount'
                  type='number'
                  value={ethSilverAmount * 0.995}
                  isReadOnly
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.16)',
                  }}
                />
                <Text fontSize="sm" color="gray.400" mt={2}>
                  Each withdrawal from the vault will incur a fee of 0.05%.
                  This fee is deducted from the withdrawal amount to cover transaction costs.
                </Text>
              </FormControl>
            </>
          )}
          footerContent={(
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                handleUnstakeOnSilverVault(ethSilverAmount, toast, fetchUserSilverVaultData, onSilverClose);
                onSilverClose();
              }}
              isDisabled={!(ethSilverAmount > 0) || (ethSilverAmount > (silverBalance.toString() / 10 ** 18))}
            >
              Unstake
            </Button>
          )}
        />
        {/* Modal pour unstake on gold vault */}
        <CustomModal
          isOpen={isGoldOpen}
          onClose={onGoldClose}
          headerContent="Unstake Eth on Gold Vault"
          bodyContent={(
            <>
              <FormControl>
                <FormLabel htmlFor='amount'>Unstake ETH</FormLabel>
                <Input
                  id='amount'
                  type='number'
                  value={ethGoldAmount}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (!isNaN(value) && value > 0) {
                      setEthGoldAmount(value);
                    } else {
                      setEthGoldAmount('');
                    }
                  }}
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.16)', // Adjust as needed
                  }}
                />
                <Text fontSize="sm" color="gray.400" mt={2}>
                  Max withdraw {goldBalance.toString() / 10 ** 18} ETH
                </Text>
              </FormControl>
              <FormControl mt={4}>
                <FormLabel htmlFor='readonly-amount'>Receive Eth</FormLabel>
                <Input
                  id='readonly-amount'
                  type='number'
                  value={ethGoldAmount * 0.995}
                  isReadOnly
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.16)',
                  }}
                />
                <Text fontSize="sm" color="gray.400" mt={2}>
                  Each withdrawal from the vault will incur a fee of 0.05%.
                  This fee is deducted from the withdrawal amount to cover transaction costs.
                </Text>
              </FormControl>
            </>
          )}
          footerContent={(
            <Button
                colorScheme="blue"
                mr={3}
                onClick={() => {
                  handleUnstakeOnGoldVault(ethGoldAmount, toast, fetchUserGoldVaultData, onGoldClose);
                  onGoldClose();
                }}
                isDisabled={!(ethGoldAmount > 0) || (ethGoldAmount > (goldBalance.toString() / 10 ** 18))}
              >
                Unstake
            </Button>
          )}
        />
        {/* Modal d'avertissement */}
        <CustomModal
          isOpen={isWarningOpen}
          onClose={() => setWarningOpen(false)}
          headerContent="You cannot unstake on Vault yet."
          bodyContent={(
            <>
              {warningMessage && <Text>Your balance does not allow you to unlock Eth on the Gold Vault.</Text>}
              {!warningMessage && <Text>Your balance does not allow you to unlock Eth on the Silver Vault</Text>}
            </>
          )}
          footerContent={(
            <></>
          )}
        />
      </Box>
    </>
  );

};

export default StakingEthPrivate;
