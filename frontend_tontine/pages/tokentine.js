// WAGMI
import { useAccount } from "wagmi";

import TokenTineComponent from "@/components/TokenTine";

export default function Tokentine() {
  // Reprendre les infos du wallet connecté
  const { isConnected, address } = useAccount();
  return (
    <>
      <TokenTineComponent isConnected={isConnected} userAddress={address} />
    </>
  );
}
