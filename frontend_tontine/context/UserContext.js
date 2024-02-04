import { createContext, useContext, useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { isAlreadyUser } from "@/services/contracts/users/tontineServices";

// Créer le contexte
const UserContext = createContext();

// Hook pour utiliser le contexte
export const useUser = () => useContext(UserContext);

// Provider du contexte
export const UserProvider = ({ children }) => {
  const { isConnected, address } = useAccount();
  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (isConnected && address) {
        try {
          const userStatus = await isAlreadyUser(address);
          setIsUser(userStatus);
        } catch (error) {
          console.error("Erreur lors de la vérification du user", error);
          setIsUser(false); // Assurez-vous de gérer l'erreur correctement
        }
      } else {
        setIsUser(false);
      }
    };

    checkUserStatus();
  }, [address, isConnected]);

  return (
    <UserContext.Provider value={{ isUser }}>{children}</UserContext.Provider>
  );
};
