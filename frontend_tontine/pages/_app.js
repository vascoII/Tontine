import "@rainbow-me/rainbowkit/styles.css";
import "@/styles/globals.css";

import Head from "next/head";

import { ChakraProvider, extendTheme, CSSReset, Box } from "@chakra-ui/react";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { hardhat, sepolia, polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";

import Header from "@/components/Header";
import DailyStats from "@/components/DailyStats";
import Footer from "@/components/Footer";
import { OwnerProvider } from "@/context/OwnerContext";
import { UserProvider } from "@/context/UserContext";
import { TineProvider } from "@/context/TineContext";
import { TontineProvider } from "@/context/TontineContext";
import { TontineStatsProvider } from "@/context/TontineStatsContext";

const { chains, publicClient } = configureChains(
  // [hardhat, sepolia, polygonMumbai],
  // [publicProvider()]
  [hardhat, sepolia, polygonMumbai],
  [
    publicProvider(),
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA_API_KEY,
    }),
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_POLYGON_API_KEY,
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "TontineSwap",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

// Étendre le thème Chakra pour inclure les styles personnalisés
const theme = extendTheme({
  styles: {
    global: {
      "html, body": {
        backgroundImage: "url('./bg02.jpg')",
        height: "100%",
        width: "100%",
        backgroundSize: "cover", // Assure que la valeur est une chaîne correcte
        backgroundPosition: "center", // Assure que la valeur est une chaîne correcte
      },
      "#__next": {
        height: "100%",
      },
    },
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          <OwnerProvider>
            <UserProvider>
              <TineProvider>
                <TontineProvider>
                  <TontineStatsProvider>
                    <Head>
                      <title>Tontine</title>
                      <link rel="icon" href="./logo.png" />
                    </Head>
                    <Box minH="100vh">
                      <Header />
                      <Component {...pageProps} />
                      <DailyStats />
                      <Footer />
                    </Box>
                  </TontineStatsProvider>
                </TontineProvider>
              </TineProvider>
            </UserProvider>
          </OwnerProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </ChakraProvider>
  );
}

export default MyApp;
