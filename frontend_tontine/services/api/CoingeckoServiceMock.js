// CoingeckoServiceMock.js

// Une fonction mock pour simuler la récupération du prix courant d'un token en une devise spécifique
// Cette ne sert que pour l affichage et la data n est pas utilisée pour aucuns calculs
function getTokenCurrentPrice(token, currency) {
  const prices = {
    ETH: {
      USD: 2500,
      EUR: 2500,
    },
    TINE: {
      USD: 2500,
      EUR: 2500,
    },
  };

  // Retournez la valeur du prix si disponible, sinon retournez null.
  return prices[token] ? prices[token][currency] : null;
}

// Une fonction mock pour simuler la récupération de l APY token en une devise spécifique
// Cette ne sert que pour l affichage et la data n est pas utilisée pour aucuns calculs
function getTokenCurrentAPY(token) {
  const prices = {
    ETH: 3.5,
    TINE: 5,
  };

  // Retournez la valeur du prix si disponible, sinon retournez null.
  return prices[token] ? prices[token] : null;
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
  getTokenCurrentAPY,
  getTontineChains,
  getTontineTokenStake,
};
