import { createContext, useContext, useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { getOwner } from "@/services/contracts/admin/tontineServices";

// Créer le contexte
const OwnerContext = createContext();

// Hook pour utiliser le contexte
export const useOwner = () => useContext(OwnerContext);

// Provider du contexte
export const OwnerProvider = ({ children }) => {
  const { isConnected, address } = useAccount();
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const checkOwnerStatus = async () => {
      if (isConnected && address) {
        try {
          const ownerStatus = await getOwner(address);
          setIsOwner(ownerStatus);
        } catch (error) {
          console.error(
            "Erreur lors de la vérification du propriétaire",
            error
          );
          setIsOwner(false); // Assurez-vous de gérer l'erreur correctement
        }
      } else {
        setIsOwner(false);
      }
    };

    checkOwnerStatus();
  }, [address, isConnected]);

  return (
    <OwnerContext.Provider value={{ isOwner }}>
      {children}
    </OwnerContext.Provider>
  );
};
