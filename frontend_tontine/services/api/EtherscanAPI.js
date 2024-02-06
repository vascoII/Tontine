// EtherscanAPI.js

async function getTokenCurrentPrice(token, currency) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_ETHERSCAN_API;
    const apiUrl = `https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${apiKey}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(
        `Etherscan API request failed with status ${response.status}`
      );
    }

    const data = await response.json();

    if (data.status === "1") {
      const ethPriceInUSD = parseFloat(data.result.ethusd);
      return ethPriceInUSD;
    } else {
      throw new Error(
        `Etherscan API request failed with message: ${data.message}`
      );
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du prix ETH en USD :", error);
    return null; // Gérer l'erreur comme vous le souhaitez
  }
}

// Une fonction mock pour simuler la récupération du nombre de chains de notre Dapp
function getTontineChains() {
  return "Etherum";
}

// Une fonction mock pour simuler la récupération du nombre de chains de notre Dapp
function getTontineTokenStake() {
  return 2;
}

function getTineCardData() {
  const tineCardData = {
    image: {
      small: "./logo.png",
    },
    name: "Tine",
    asset_platform_id: "Tine Token",
    market_data: {
      current_price: {
        usd: 2500,
      },
    },
  };
}

module.exports = {
  getTokenCurrentPrice,
  getTontineChains,
  getTontineTokenStake,
};
