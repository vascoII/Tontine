export async function getSimpleStakeAPR() {
  try {
    return 3.13;
  } catch (error) {
    console.error("Erreur lors de la récupération de l APR Simple", error);
    return null; // Gérer l'erreur comme vous le souhaitez
  }
}

export async function getNodeStakeAPR() {
  try {
    return 6.92;
  } catch (error) {
    console.error("Erreur lors de la récupération de l APR Node", error);
    return null; // Gérer l'erreur comme vous le souhaitez
  }
}
