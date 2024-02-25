# Tontine: A Decentralized Staking Protocol

## Overview

Tontine is a decentralized application (dApp) built on Solidity, designed to offer an approach to staking and earning interest in the DeFi space. The project consists of two main parts: the smart contracts (backend) and the user interface (frontend). This repository contains both the backend and frontend codebases, organized into separate directories for ease of navigation and development.

## Project Structure

- `/backend_tontine`: Contains the smart contracts, deployment scripts, and tests for the Tontine protocol. The backend is built using Hardhat, providing a robust framework for developing Solidity smart contracts.
- `/frontend_tontine`: The frontend application, developed with React and Next.js, offers a user-friendly interface for interacting with the Tontine protocol. It includes features such as token buying, locking, and staking blockchains native tokens in two different vaults.

## Getting Started

To get started with the Tontine dApp, please refer to the README files in the respective `backend_tontine` and `frontend_tontine` directories for detailed setup instructions and documentation.

## Features

- **Smart Contract Backend**: Secure and efficient handling of all blockchain interactions, including token management, staking, and interest calculations.
- **Intuitive Frontend**: A seamless user experience for staking native token from different chains, managing TINE tokens, and viewing interest accrual in real-time.

## Contributing

We welcome contributions to the Tontine project! Please check out the README files in the `backend_tontine` and `frontend_tontine` directories for guidelines on how to contribute to each part of the project.

## RoadMap

Our development journey is organized into four strategic phases to ensure a robust, flexible, and user-centric deployment. Here's a glimpse into our roadmap:

### Phase 1: Smart Contract Abstraction and Development

- Objective: Refactor our smart contracts to incorporate abstraction layers, enabling seamless integration across various Layer 2 solutions and token standards. This ensures our dApp is not only future-proof but also adaptable to the evolving DeFi ecosystem.
- Actions: Design and implement smart contract interfaces that can interact with multiple types of tokens and protocols without being tied to a specific implementation, allowing for greater flexibility in deployment and integration.

### Phase 2: Mocking and Initial Testing

- Objective: Utilize mock contracts for the development and initial testing phase. This allows us to simulate interactions with external tokens and oracle services, facilitating rapid development and iteration of our core functionalities without the need for live protocols or incurring transaction costs.
- Actions: Create and integrate mock contracts to test the internal logic of our dApp, ensuring that key features such as interest calculations and staking mechanisms are functioning as intended in a controlled environment.

### Phase 3: Comprehensive Testing

- Objective: Conduct thorough testing of our dApp across various scenarios and use cases. This phase is critical to identify and rectify any potential issues, ensuring that our application is robust, secure, and ready for real-world deployment.
- Actions: Perform unit tests, integration tests, and simulation tests on testnets to validate the dApp's performance, security, and user experience. This step includes testing the dApp's interaction with real Layer 2 networks and external protocols to ensure compatibility and efficiency.

### Phase 4: Integration with Live Oracles and Protocols

- Objective: Transition from mock contracts to integrating with actual oracle services and DeFi protocols. This phase aims to validate the dApp's functionality in the live DeFi ecosystem and demonstrate its capability to handle real transactions and interactions.
- Actions: Implement connections to live oracle services for accurate data feeds and integrate with established DeFi protocols for staking and other functionalities. This step is crucial for showcasing the dApp's real-world utility and preparing for a mainnet launch.

This roadmap is designed to guide our development process, from conceptualization to a fully functional dApp that leverages the power of DeFi and blockchain technology. We welcome collaboration, feedback, and support from the community as we embark on this exciting journey.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Authors

- vascoII - _Initial work_

![image](https://github.com/vascoII/Tontine/assets/7952254/1371428f-5c5e-41c2-8b0c-a70148cd32f6)
