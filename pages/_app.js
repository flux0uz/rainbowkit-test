import {
  getDefaultWallets,
  wallet,
  RainbowKitProvider,
  darkTheme,
} from '@rainbow-me/rainbowkit';

import { providers } from 'ethers';

import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { infuraProvider } from 'wagmi/providers/infura';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';

import '@rainbow-me/rainbowkit/styles.css';
import '../styles/globals.css';

const infuraId = process.env.NEXT_PUBLIC_INFURA_ID;
const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID;
const env = process.env.NEXT_PUBLIC_NODE_ENV;

const { chains, provider } = configureChains(
  env === 'production' ? [chain.polygon] : [chain.polygonMumbai, chain.polygon],
  [
    jsonRpcProvider({
      priority: 0,
      rpc: (chain) => ({
        http:
          chain.id === 80001
            ? 'https://matic-mumbai.chainstacklabs.com'
            : 'https://polygon-rpc.com/',
      }),
    }),
    alchemyProvider({
      alchemyId: alchemyId,
      priority: 1,
    }),
    infuraProvider({
      infuraId: infuraId,
      priority: 2,
    }),
    publicProvider({ priority: 3 }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Bolero Music',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider(config) {
    return new providers.AlchemyWebSocketProvider(config.chainId, alchemyId);
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        theme={darkTheme({
          accentColor: 'var(--primary-color)',
          accentColorForeground: 'white',
          borderRadius: 'medium',
          fontStack: 'rounded',
          overlayBlur: 'small',
        })}
      >
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
