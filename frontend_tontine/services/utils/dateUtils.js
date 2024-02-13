// Fonction pour formater une date en YYYY-mm-dd
export const formatDate = (timestamp) => {
  const date = new Date(Number(timestamp) * 1000); // Convertir le timestamp en millisecondes
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Ajouter un 0 devant si le mois est < 10
  const day = String(date.getDate()).padStart(2, "0"); // Ajouter un 0 devant si le jour est < 10
  return `${year}-${month}-${day}`;
};
