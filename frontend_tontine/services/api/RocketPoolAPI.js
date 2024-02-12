export async function getSimpleStakeAPR() {
  try {
    return 5;
  } catch (error) {
    console.error("Erreur lors de la récupération de l APR Simple", error);
    return null; // Gérer l'erreur comme vous le souhaitez
  }
}

export async function getNodeStakeAPR() {
  try {
    return 10;
  } catch (error) {
    console.error("Erreur lors de la récupération de l APR Node", error);
    return null; // Gérer l'erreur comme vous le souhaitez
  }
}
