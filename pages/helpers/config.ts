import { http, createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'

export const txconfig = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http("https://eth-mainnet.g.alchemy.com/v2/yFrQtMFF9AoM9EaMb3R-LKhx3Qe9OceL"),
    [sepolia.id]: http("https://eth-sepolia.g.alchemy.com/v2/xRVtn9ZgyBvoDYbJR15cFf6AZzHUUi3V"),
  },
 })