// WAGMI
import { useAccount } from "wagmi";

import StakingComponent from "@/components/Staking";

export default function Staking() {
  // Reprendre les infos du wallet connecté
  const { isConnected, address } = useAccount();
  return (
    <>
      <StakingComponent isConnected={isConnected} userAddress={address} />
    </>
  );
}
