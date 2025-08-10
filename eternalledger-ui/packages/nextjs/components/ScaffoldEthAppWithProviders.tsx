"use client";

import { useEffect, useState } from "react";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";
import { WagmiProvider } from "wagmi";
import FloatingExplorer from "~~/components/FloatingExplorer";
import FloatingThemeToggle from "~~/components/FloatingThemeToggle";
import { Footer } from "~~/components/Footer";
import GlobalNav from "~~/components/GlobalNav";
import { Header } from "~~/components/Header";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { useInitializeNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  useInitializeNativeCurrencyPrice();

  return (
    <>
      <div className={`flex flex-col min-h-screen `}>
        <Header />
        <main className="relative flex flex-col flex-1">{children}</main>
        <Footer />
      </div>
      <Toaster />
    </>
  );
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

// export const ScaffoldEthAppWithProviders = ({ children }: { children: React.ReactNode }) => {
//   const { resolvedTheme } = useTheme();
//   const isDarkMode = resolvedTheme === "dark";
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   return (
//     <WagmiProvider config={wagmiConfig}>
//       <QueryClientProvider client={queryClient}>
//         <RainbowKitProvider
//           avatar={BlockieAvatar}
//           theme={mounted ? (isDarkMode ? darkTheme() : lightTheme()) : lightTheme()}
//         >
//           <ProgressBar height="3px" color="#2299dd" />
//           <ScaffoldEthApp>{children}</ScaffoldEthApp>
//         </RainbowKitProvider>
//       </QueryClientProvider>
//     </WagmiProvider>
//   );
// };

export function ScaffoldEthAppWithProviders({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ProgressBar />
          <GlobalNav />

          <div className="flex flex-col min-h-screen">
            <main className="relative flex flex-col flex-1">{children}</main>
          </div>

          <FloatingThemeToggle />
          <FloatingExplorer />

          <Toaster />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
