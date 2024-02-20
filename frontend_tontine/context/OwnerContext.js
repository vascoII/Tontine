import { createContext, useContext, useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useChainId } from "wagmi";
import { getContractInfo } from "@/services/contracts/contractInfo";
import { getOwner } from "@/services/contracts/admin/tontineServices";

// Créer le contexte
const OwnerContext = createContext();

// Hook pour utiliser le contexte
export const useOwner = () => useContext(OwnerContext);

// Provider du contexte
export const OwnerProvider = ({ children }) => {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const [isOwner, setIsOwner] = useState(false);

  const {
    contractAddressTontine: contractAddressTontine,
    abiTontine: abiTontine,
  } = getContractInfo(chainId);

  useEffect(() => {
    const checkOwnerStatus = async () => {
      if (isConnected && address) {
        try {
          const ownerStatus = await getOwner(
            address,
            contractAddressTontine,
            abiTontine
          );
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
  }, [address, isConnected, chainId]);

  return (
    <OwnerContext.Provider value={{ isOwner }}>
      {children}
    </OwnerContext.Provider>
  );
};
