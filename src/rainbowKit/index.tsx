'use client';

import { RainbowKitProvider, connectorsForWallets } from '@rainbow-me/rainbowkit';
import { metaMaskWallet, rainbowWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { particleGoogleWallet, particleTwitterWallet, particleWallet } from '../particleWallet';
import { createClient } from 'viem';
import { AuthCoreContextProvider } from '@particle-network/auth-core-modal';

const connectors = connectorsForWallets(
    [
        {
            groupName: 'Recommended',
            wallets: [
                particleGoogleWallet,
                particleTwitterWallet,
                particleWallet,
                metaMaskWallet,
                rainbowWallet,
                walletConnectWallet,
            ],
        },
    ],
    {
        appName: 'My RainbowKit App',
        projectId: 'YOUR_PROJECT_ID',
    }
);

const config = createConfig({
    connectors,
    chains: [mainnet, sepolia],
    client({ chain }) {
        return createClient({
            chain,
            transport: http(undefined, {
                retryCount: 0,
            }),
        });
    },
    ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthCoreContextProvider
            options={{
                projectId: '34c6b829-5b89-44e8-90a9-6d982787b9c9',
                clientKey: 'c6Z44Ml4TQeNhctvwYgdSv6DBzfjf6t6CB0JDscR',
                appId: 'ded98dfe-71f9-4af7-846d-5d8c714d63b0',
                customStyle: {
                    zIndex: 2147483650, // must greater than 2147483646
                },
            }}
        >
            <WagmiProvider config={config}>
                <QueryClientProvider client={queryClient}>
                    <RainbowKitProvider>{children}</RainbowKitProvider>
                </QueryClientProvider>
            </WagmiProvider>
        </AuthCoreContextProvider>
    );
}
