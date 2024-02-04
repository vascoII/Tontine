import React, { useState, useEffect } from 'react';

import {
  Box, Heading, Text, Collapse, Button, Flex, useToast, useDisclosure,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, ModalFooter
} from "@chakra-ui/react";

import {
  getSmartContractTokenBalanceService,
  getSmartContractEthBalanceService, 
  getSmartContractMaxSupplyService, 
  getSmartContractCurrentSupplyService, 
  getSmartContractMaxBalanceService,
  getSmartContractMinLockTimeService, 
  getSmartContractMinLockAmountService
} from "@/services/contracts/users/tineServices";

import {
  mintMonthlyService, 
  setSmartContracMinLockTimeService,
  setSmartContracMinLockAmountService,
  withdrawEthService, 
  setSmartContractMaxBalanceService
} from "@/services/contracts/admin/tineServices";

import {
  Error_mintMonthly_supply_exceeded,
  Error_mintMonthly_not_allowed,
  Error_setMinLockTime_Lock_time_must_be_greater_than_0,
  Error_setMinLockAmount_amount_must_be_greater_than_0,
  Error_withdrawEth_amount_must_be_greater_than_0,
  Error_withdrawEth_insufficient_Eth_balance_in_protocol,
  Error_withdrawEth_invalid_recipient_address
} from "@/constants";

const TokenTineAdmin = ({ isConnected, userAddress }) => {
  const [showContent, setShowContent] = useState(false);
  const handleToggle = () => setShowContent(!showContent);
  const [clientIsConnected, setClientIsConnected] = useState(false);

  const [smartContractTokenBalance, setSmartContractTokenBalance] = useState(0);
  const [smartContractEthBalance, setSmartContractEthBalance] = useState(0);
  const [smartContractMaxSupply, setSmartContractMaxSupply] = useState(0);
  const [smartContractMaxBalance, setSmartContractMaxBalance] = useState(0);
  const [smartContractCurrentSupply, setSmartContractCurrentSupply] = useState(0);
  const [smartContractMintMonthly, setSmartContractMintMonthly] = useState(0);
  const [smartContractMinLockTime, setSmartContractMinLockTime] = useState(0);
  const [smartContractMinLockAmount, setSmartContractMinLockAmount] = useState(0);

  const [smartContractWithdrawEth, setSmartContractWithdrawEth] = useState(0);
  const [smartContractNewMinLockTime, setSmartContractNewMinLockTime] = useState(0);
  const [smartContractNewMinLockAmount, setSmartContractNewMinLockAmount] = useState(0);
  const [smartContractNewMaxBalance, setSmartContractNewMaxBalance] = useState(0);

  const toast = useToast();

  const { isOpen: isMintOpen, onOpen: onMintOpen, onClose: onMintClose } = useDisclosure();
  const { isOpen: isLockTimeOpen, onOpen: onLockTimeOpen, onClose: onLockTimeClose } = useDisclosure();
  const { isOpen: isLockAmountOpen, onOpen: onLockAmountOpen, onClose: onLockAmountClose } = useDisclosure();
  const { isOpen: isWithdrawOpen, onOpen: onWithdrawOpen, onClose: onWithdrawClose } = useDisclosure();
  const { isOpen: isBalanceOpen, onOpen: onBalanceOpen, onClose: onBalanceClose } = useDisclosure();

  //Way to manage SSR Problems
  useEffect(() => {
    // Since isConnected is only true on the client-side after hydration,
    // set clientIsConnected based on isConnected when component mounts.
    setClientIsConnected(isConnected);
    handleGetSmartContractTokenBalance();
    handleGetSmartContractEthBalance();
    handleGetSmartContractCurrentSupply();
    handleGetSmartContractMaxSupply();
    handleGetSmartContractMaxBalance();
    handleGetSmartContractMinLockTime();
    handleGetSmartContractMinLockAmount();
  }, [isConnected]); 

  /*************** GETTERS *****************************/
  /** TOKEN BALANCE */
  const handleGetSmartContractTokenBalance = async () => {
    try {
      const smartContractTineBalance = await getSmartContractTokenBalanceService(); 
      setSmartContractTokenBalance(smartContractTineBalance);
    } catch (err) {
      toast({
        title: "Error!",
        description: "An error occured on token balance.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  /** ETH BALANCE */
  const handleGetSmartContractEthBalance = async () => {
    try {
      const smartContractEthBalance = await getSmartContractEthBalanceService(); 
      setSmartContractEthBalance(smartContractEthBalance);
    } catch (err) {
      toast({
        title: "Error!",
        description: "An error occured on eth balance.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  /** TOTAL SUPPLY */
  const handleGetSmartContractCurrentSupply = async () => {
    try {
      const totalSupply = await getSmartContractCurrentSupplyService(); 
      setSmartContractCurrentSupply(totalSupply);
    } catch (err) {
      toast({
        title: "Error!",
        description: "An error occured on total supply.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

   /** MAX SUPPLY */
  const handleGetSmartContractMaxSupply = async () => {
    try {
      const maxSupply = await getSmartContractMaxSupplyService();
      setSmartContractMaxSupply(Math.round(maxSupply.toString() / 10 ** 18));
    } catch (err) {
      toast({
        title: "Error!",
        description: "An error occured on max supply.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  /** MAX BALANCE */
  const handleGetSmartContractMaxBalance = async () => {
    try {
      const maxBalance = await getSmartContractMaxBalanceService();
      setSmartContractMaxBalance(maxBalance);
    } catch (err) {console.log(err.message)
      toast({
        title: "Error!",
        description: "An error occured on max balance.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  /** MIM LOCK TIME */
  const handleGetSmartContractMinLockTime = async () => {
    try {
      const smartContractMinLockTimeService = await getSmartContractMinLockTimeService(); 
      setSmartContractMinLockTime(smartContractMinLockTimeService);
    } catch (err) {
      toast({
        title: "Error!",
        description: "An error occured on setting min lock time.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  /** MIN LOCK AMOUNT */
  const handleGetSmartContractMinLockAmount = async () => {
    try {
      const smartContractMinLockAmountService = await getSmartContractMinLockAmountService(); 
      setSmartContractMinLockAmount(smartContractMinLockAmountService);
    } catch (err) {alert(err.message)
      toast({
        title: "Error!",
        description: "An error occured on setting min lock amount.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  /**************** SETTERS  ****************************/
  /** MINT MONTHLY */
  const handleSmartContractMintMonthly = async () => {
    try {
      const smartContractTineMintMonthly = await mintMonthly(); 
      setSmartContractMintMonthly(smartContractTineMintMonthly);
    } catch (err) {
      if (err.message.includes(Error_mintMonthly_not_allowed)) {
        toast({
          title: "Error!",
          description: "Mint period is not open yet.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error!",
          description: "An error occured on mint monthly.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

   /** WITHDRAW ETH */
  const handleSmartContractWithdrawEth = async () => {
    try {
      await withdrawEthService(smartContractWithdrawEth, userAddress); 
      setSmartContractWithdrawEth(smartContractWithdrawEth);
      toast({
          title: "Congratulations!",
          description: `You have successfully withdraw Eth.`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
    } catch (err) {alert(err.message)
      toast({
        title: "Error!",
        description: "An error occured on eth withdraw.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  /** SET MAX BALANCE */
  const handleSetSmartContractMaxBalance = async () => {
    try {
      await setSmartContractMaxBalanceService(smartContractNewMaxBalance);
      setSmartContractMaxBalance(smartContractNewMaxBalance * 10 ** 18);
    } catch (err) {
      toast({
        title: "Error!",
        description: "An error occured on setting new Max Balance.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  /** LOCK TIME */
  const handleSetSmartContractMinLockTime = async () => {
    try {
      await setSmartContracMinLockTimeService(smartContractNewMinLockTime); 
      setSmartContractMinLockTime(smartContractNewMinLockTime);
    } catch (err) {
      toast({
        title: "Error!",
        description: "An error occured on current min lock time.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  /** LOCK AMOUNT */
  const handleSetSmartContractMinLockAmount = async () => {
    try {
      await setSmartContracMinLockAmountService(smartContractNewMinLockAmount); 
      setSmartContractMinLockAmount(smartContractNewMinLockAmount * 10 ** 18);
    } catch (err) {
      toast({
        title: "Error!",
        description: "An error occured on current min lock amount.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  return (
    <>
      {isConnected && 
        <Box
          className="card-container"
          p={4}
          w="full" 
          maxW="90%" 
          h="auto" 
          my={5} 
          mx="auto"
        >
        <img src='./assets/wallet1.svg' alt="TineAdmin" />
        <Heading
          onClick={handleToggle}
          cursor="pointer"
        >
          Tine Smart contract Manager
        </Heading>
        <Collapse in={showContent} animateOpacity>
          <Box
            p="10px"
            color="white"
            mt="4"
            bg="teal.500"
            rounded="md"
            shadow="md"
            bgColor="#131330"
          >
            <Flex className='features-list-container-admin' width='100%' justifyContent="center" alignItems="center" marginTop='20px'>
              <Box className="card-container">
                <img src='./assets/profit1.svg' alt="Balance" />
                <Heading>Token Balance</Heading>
                <Text fontSize="xl" className="metric-value" color='#ffff' textAlign='right'>{smartContractTokenBalance.toString() / 10 ** 18} Tine</Text>
              </Box>
              <Box className="card-container">
                <img src='./assets/profit1.svg' alt="Balance" />
                <Heading>Max Supply</Heading>
                <Text fontSize="xl" className="metric-value" color='#ffff' textAlign='right'>{smartContractMaxSupply.toString()} Tine</Text>
              </Box>  
              <Box className="card-container">
                <img src='./assets/profit1.svg' alt="Balance" />
                <Heading>Current Supply</Heading>
                <Text fontSize="xl" className="metric-value" color='#ffff' textAlign='right'>{smartContractCurrentSupply.toString() / 10 ** 18} Tine</Text>
              </Box>
              <Box className="card-container">
                <img src='./assets/profit1.svg' alt="Balance" />
                <Heading>Current Balance</Heading>
                <Text fontSize="xl" className="metric-value" color='#ffff' textAlign='right'>{smartContractEthBalance.toString() / 10 ** 18} Eth</Text>
              </Box>
              <Box className="card-container">
                <img src='./assets/profit1.svg' alt="Balance" />
                <Heading>Max Balance</Heading>
                <Text fontSize="xl" className="metric-value" color='#ffff' textAlign='right'>{smartContractMaxBalance.toString() / 10 ** 18} Eth</Text>
              </Box>  
              <Box className="card-container">
                <img src='./assets/profit1.svg' alt="Balance" />
                <Heading>Current Lock Time</Heading>
                <Text fontSize="xl" className="metric-value" color='#ffff' textAlign='right'>{smartContractMinLockTime.toString()} second</Text>
              </Box>
              <Box className="card-container">
              <img src='./assets/profit1.svg' alt="Balance" />
                <Heading>Current Lock Amnt</Heading>
                <Text fontSize="xl" className="metric-value" color='#ffff' textAlign='right'>{smartContractMinLockAmount.toString() / 10 ** 18} Tine</Text>
              </Box>  
            </Flex>
            <Flex className='features-list-container-admin' width='100%' justifyContent="center" alignItems="center" marginTop='20px'>
              <Box className="card-container">
                <img src='./assets/blog.svg' alt="Balance" />
                <Heading>Withdraw Eth</Heading>
                <Box className="card-container" onClick={onWithdrawOpen}>
                  {/* Vos autres éléments de carte ici */}
                  <Text>Withdraw</Text>
                </Box>
              </Box>  
              <Box className="card-container">
                <img src='./assets/blog.svg' alt="Balance" />
                <Heading>Mint</Heading>
                <Box className="card-container" onClick={onMintOpen}>
                  {/* Vos autres éléments de carte ici */}
                  <Text>Mint Tine</Text>
                </Box>
              </Box> 
              <Box className="card-container">
                <img src='./assets/paper.svg' alt="Balance" />
                <Heading>Max Balance</Heading>
                <Box className="card-container" onClick={onBalanceOpen}>
                  {/* Vos autres éléments de carte ici */}
                  <Text>Change max balance</Text>
                </Box>
              </Box>
              <Box className="card-container">
                <img src='./assets/paper.svg' alt="Balance" />
                <Heading>Lock Time</Heading>
                <Box className="card-container" onClick={onLockTimeOpen}>
                  {/* Vos autres éléments de carte ici */}
                  <Text>Change lock time</Text>
                </Box>
              </Box>
              <Box className="card-container">
              <img src='./assets/paper.svg' alt="Balance" />
                <Heading>Lock Amount</Heading>
                <Box className="card-container" onClick={onLockAmountOpen}>
                  {/* Vos autres éléments de carte ici */}
                  <Text>Change lock amount</Text>
                </Box>
              </Box>  
            </Flex>  
          </Box>
        </Collapse>
        </Box>
      }
      <Box>
        {/* Modal pour mint Tine */}
        <Modal isOpen={isMintOpen} onClose={onMintClose}>
          <ModalOverlay />
          <ModalContent
            style={{
              padding: '20px',
              backgroundColor: '#131330',
              color: '#fff',
              borderRadius: '10px',
              border: 'double 1px transparent',
              backgroundClip: 'padding-box, border-box',
              backgroundOrigin: 'border-box',
              backgroundImage:
                'linear-gradient(#131330 0 0) padding-box, linear-gradient(to top left, transparent, #30bddc) border-box',
            }}
          >
            <ModalHeader>Mint Tine</ModalHeader>
            <ModalCloseButton />
            <ModalBody/>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={() => {
                handleSmartContractMintMonthly();
                onMintClose();
              }}>
                Mint
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        {/* Modal pour changer le mini lock time */}
        <Modal isOpen={isLockTimeOpen} onClose={onLockTimeClose}>
          <ModalOverlay />
          <ModalContent
            style={{
              padding: '20px',
              backgroundColor: '#131330',
              color: '#fff',
              borderRadius: '10px',
              border: 'double 1px transparent',
              backgroundClip: 'padding-box, border-box',
              backgroundOrigin: 'border-box',
              backgroundImage:
                'linear-gradient(#131330 0 0) padding-box, linear-gradient(to top left, transparent, #30bddc) border-box',
            }}
          >
            <ModalHeader>Change minimum lock time</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel htmlFor='amount'>Time in second</FormLabel>
                <Input id='amount' type='number' value={smartContractNewMinLockTime} onChange={(e) => setSmartContractNewMinLockTime(e.target.value)} />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={() => {
                handleSetSmartContractMinLockTime(smartContractNewMinLockTime);
                onLockTimeClose();
              }}>
                Change
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        {/* Modal pour le mini lock amount */}
        <Modal isOpen={isLockAmountOpen} onClose={onLockAmountClose}>
          <ModalOverlay />
          <ModalContent
            style={{
              padding: '20px',
              backgroundColor: '#131330',
              color: '#fff',
              borderRadius: '10px',
              border: 'double 1px transparent',
              backgroundClip: 'padding-box, border-box',
              backgroundOrigin: 'border-box',
              backgroundImage:
                'linear-gradient(#131330 0 0) padding-box, linear-gradient(to top left, transparent, #30bddc) border-box',
            }}
          >
            <ModalHeader>Change minimum lock amount</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel htmlFor='amount'>Amount in Tine</FormLabel>
                <Input id='amount' type='number' value={smartContractNewMinLockAmount} onChange={(e) => setSmartContractNewMinLockAmount(e.target.value)} />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={() => {
                handleSetSmartContractMinLockAmount(smartContractNewMinLockAmount);
                onLockAmountClose();
              }}>
                Change
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        {/* Modal pour withdraw */}
        <Modal isOpen={isWithdrawOpen} onClose={onWithdrawClose}>
          <ModalOverlay />
          <ModalContent
            style={{
              padding: '20px',
              backgroundColor: '#131330',
              color: '#fff',
              borderRadius: '10px',
              border: 'double 1px transparent',
              backgroundClip: 'padding-box, border-box',
              backgroundOrigin: 'border-box',
              backgroundImage:
                'linear-gradient(#131330 0 0) padding-box, linear-gradient(to top left, transparent, #30bddc) border-box',
            }}
          >
            <ModalHeader>Withdraw</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel htmlFor='amount'>Amount to withdraw</FormLabel>
                <Input id='amount' type='number' value={smartContractWithdrawEth} onChange={(e) => setSmartContractWithdrawEth(e.target.value)} />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={() => {
                handleSmartContractWithdrawEth(smartContractWithdrawEth);
                onWithdrawClose();
              }}>
                Withdraw
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        {/* Modal pour max balance */}
        <Modal isOpen={isBalanceOpen} onClose={onBalanceClose}>
          <ModalOverlay />
          <ModalContent
            style={{
              padding: '20px',
              backgroundColor: '#131330',
              color: '#fff',
              borderRadius: '10px',
              border: 'double 1px transparent',
              backgroundClip: 'padding-box, border-box',
              backgroundOrigin: 'border-box',
              backgroundImage:
                'linear-gradient(#131330 0 0) padding-box, linear-gradient(to top left, transparent, #30bddc) border-box',
            }}
          >
            <ModalHeader>Max balance</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel htmlFor='amount'>New max balance in Eth</FormLabel>
                <Input id='amount' type='number' value={smartContractNewMaxBalance} onChange={(e) => setSmartContractNewMaxBalance(e.target.value)} />
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={() => {
                handleSetSmartContractMaxBalance(smartContractNewMaxBalance);
                onBalanceClose();
              }}>
                Change
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>

    </>
  );
};

export default TokenTineAdmin;
