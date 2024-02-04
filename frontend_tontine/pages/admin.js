// WAGMI
import { useAccount } from "wagmi";

import AdminComponent from "@/components/Admin";

export default function Admin() {
  // Reprendre les infos du wallet connecté
  const { isConnected, address } = useAccount();
  return (
    <>
      <AdminComponent isConnected={isConnected} userAddress={address} />
    </>
  );
}
