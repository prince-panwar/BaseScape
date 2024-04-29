import { http, createConfig } from 'wagmi'
import {base } from 'wagmi/chains'

const txnconfig = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC_URL || ''),
   
  },
 })

 export default txnconfig;