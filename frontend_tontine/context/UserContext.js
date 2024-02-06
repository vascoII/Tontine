import { createContext, useContext, useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { isAlreadyUser } from "@/services/contracts/users/tontineServices";

// Créer le contexte
const UserContext = createContext();

// Hook pour utiliser le contexte
export const useUser = () => useContext(UserContext);

import {
  getTineLockedDateService,
  getUserTineBalanceService,
} from "@/services/contracts/users/tineServices";

// Provider du contexte
export const UserProvider = ({ children }) => {
  const { isConnected, address } = useAccount();
  const [isUser, setIsUser] = useState(false);
  const [tineUserBalance, setTineUserBalance] = useState(0);
  const [userTineLockedDate, setTineLockedDate] = useState("");

  useEffect(() => {
    const checkUserStatus = async () => {
      if (isConnected && address) {
        try {
          const userStatus = await isAlreadyUser(address);
          setIsUser(userStatus);

          const userBalance = await getUserTineBalanceService(address);
          setTineUserBalance(userBalance.toString() / 10 ** 18);

          const tineLockedDate = await getTineLockedDateService(address);
          if (tineLockedDate > 0) {
            // Convertir le timestamp Solidity (en secondes) en millisecondes pour JavaScript
            const date = new Date(Number(tineLockedDate) * 1000);
            const formattedDate = date.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            });

            setTineLockedDate(formattedDate);
          }
        } catch (error) {
          console.error("Erreur lors de la vérification du user", error);
          setIsUser(false); // Assurez-vous de gérer l'erreur correctement
        }
      }
    };

    checkUserStatus();
  }, [address, isConnected, tineUserBalance, userTineLockedDate]);

  return (
    <UserContext.Provider
      value={{
        isUser,
        tineUserBalance,
        setTineUserBalance,
        userTineLockedDate,
        setTineLockedDate,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
