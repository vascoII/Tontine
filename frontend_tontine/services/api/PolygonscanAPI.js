// PolygonscanAPI.js

async function getTokenCurrentMaticPrice(token, currency) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_POLYGONSCAN_API;
    const apiUrl = `https://api-testnet.polygonscan.com/api?module=stats&action=maticprice&apikey=${apiKey}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(
        `Polygonscan API request failed with status ${response.status}`
      );
    }

    const data = await response.json();

    if (data.status === "1") {
      const priceInUSD = parseFloat(data.result.maticusd);
      const roundedPrice = parseFloat(priceInUSD.toFixed(5)); // Arrondir à deux chiffres après la virgule et reconvertir en nombre

      // Retourner le prix arrondi
      return roundedPrice;
    } else {
      throw new Error(
        `Polygonscan API request failed with message: ${data.message}`
      );
    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du prix MATIC en USD :",
      error
    );
    return null; // Gérer l'erreur comme vous le souhaitez
  }
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

async function getTineMaticRatio() {
  return 1;
}

module.exports = {
  getTokenCurrentMaticPrice,
  getTineMaticRatio,
};
