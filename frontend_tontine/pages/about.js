// WAGMI
import { useAccount } from "wagmi";

import AboutComponent from "@/components/About";

export default function About() {
  // Reprendre les infos du wallet connecté
  const { isConnected } = useAccount();
  return (
    <>
      <AboutComponent isConnected={isConnected} />
    </>
  );
}
