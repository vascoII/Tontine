
# Tontine DApp Frontend

## Overview

The frontend of the Tontine dApp, developed using React, Next.js, and styled with Chakra UI, provides a user-friendly and intuitive interface. It enables users to interact seamlessly with the underlying smart contracts, guiding them through the processes of buying, locking, and unlocking TINE tokens, as well as managing deposits and withdrawals from the Silver and Gold Vaults.

## Key Features

- **User Dashboard**: Displays essential information such as current TINE balance, locked TINE status, and individual vault balances.
- **Interactive Staking Interface**: Facilitates easy staking of ETH in either the Silver or Gold Vault.
- **Dynamic Earning Calculations**: Dynamically calculates potential earnings based on deposited amounts and chosen vault.
- **Admin Panel**: Allows the dApp administrator to mint TINE, adjust parameters, and manage the contract's ETH balance.

## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/vascoII/Tontine.git
   ```

2. Navigate to the frontend directory and install dependencies:
   ```
   cd frontend_tontine
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

   The frontend is accessible through `localhost:3000`.

## Architecture Overview

The frontend architecture is designed to enhance usability, maintainability, and developer experience. It includes:

- **Components**: Reusable UI components and layout components.
- **Constants**: Constants such as contract addresses and ABI.
- **Context**: React contexts for global state management.
- **Hooks**: Custom React hooks for logic encapsulation.
- **Pages**: Application pages, utilizing Next.js's routing.
- **Public**: Static assets like images and fonts.
- **Services**: External services interaction, including smart contract interactions.
- **Styles**: Global styles and theme settings.

## Authors

- vascoII

## License

This project is licensed under the MIT License - see the LICENSE file for details.
