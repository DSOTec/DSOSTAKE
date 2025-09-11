import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { QueryClientProvider, QueryClient,} from "@tanstack/react-query";


const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: '23512daf96f50f2920bb1b709b01503d',
  chains: [sepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
  analytics: false, // Disable MetaMask analytics to prevent fetch errors
});
const queryClient = new QueryClient();



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider config={config}
        theme={darkTheme({
    accentColor: '#fff',   // ✅ change button color (example: green)
    accentColorForeground: '#aa00f5', // text color on button
    borderRadius: 'large',
    fontStack: 'system',
  })}>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>,
)
