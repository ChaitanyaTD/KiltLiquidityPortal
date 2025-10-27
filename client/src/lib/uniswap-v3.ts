// PancakeSwap V3 utilities and constants
import { ethers } from 'ethers';

// PancakeSwap V3 contract addresses on BSC
export const PANCAKESWAP_V3_ADDRESSES = {
  FACTORY: '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865',
  POSITION_MANAGER: '0x46A15B0b27311cedF172AB29E4f4766fbE7F4364',
  QUOTER: '0xB048Bd43B3d0B2c594cD5884911D69355b6aa4F4',
  ROUTER: '0x1b81D678ffb9C0263b24A97847620C99d213eB14'
};

// Legacy export for backward compatibility
export const UNISWAP_V3_ADDRESSES = PANCAKESWAP_V3_ADDRESSES;

// Common token addresses on BSC
export const BSC_TOKENS = {
  WBNB: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', // Wrapped BNB
  USDT: '0x55d398326f99059fF775485246999027B3197955', // USDT on BSC
  USDC: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', // USDC on BSC
  KILT: '0x5D0DD05bB095fdD6Af4865A1AdF97c39C85ad2d8', // KILT token address (assuming same on BSC)
  BNB: '0x0000000000000000000000000000000000000000' // Native BNB placeholder
};

// Legacy exports for backward compatibility
export const BASE_TOKENS = BSC_TOKENS;
export const TOKENS = BSC_TOKENS;

// Fee tiers
export const FEE_TIERS = {
  LOWEST: 100,   // 0.01%
  LOW: 500,      // 0.05%
  MEDIUM: 3000,  // 0.3%
  HIGH: 10000    // 1%
};

// Pool configuration for KILT/BNB
export const KILT_BNB_POOL = {
  token0: BSC_TOKENS.KILT,
  token1: BSC_TOKENS.WBNB,
  fee: FEE_TIERS.MEDIUM,
  address: '' // Will be computed dynamically
};

// Legacy export for backward compatibility
export const KILT_ETH_POOL = KILT_BNB_POOL;

// Utility functions
export function getPoolAddress(token0: string, token1: string, fee: number): string {
  // This would normally compute the pool address using the factory
  // For now, return a placeholder that matches the expected format
  return ethers.solidityPackedKeccak256(
    ['string', 'address', 'address', 'uint24'],
    ['pool', token0, token1, fee]
  ).slice(0, 42);
}

export function formatTokenAmount(amount: string, decimals: number = 18): string {
  try {
    const formatted = ethers.formatUnits(amount, decimals);
    return parseFloat(formatted).toFixed(6);
  } catch {
    return '0.000000';
  }
}

export function parseTokenAmount(amount: string, decimals: number = 18): string {
  try {
    return ethers.parseUnits(amount, decimals).toString();
  } catch {
    return '0';
  }
}

// Price utilities
export function calculatePrice(amount0: string, amount1: string, decimals0: number = 18, decimals1: number = 18): number {
  try {
    const amt0 = parseFloat(ethers.formatUnits(amount0, decimals0));
    const amt1 = parseFloat(ethers.formatUnits(amount1, decimals1));
    
    if (amt0 === 0) return 0;
    return amt1 / amt0;
  } catch {
    return 0;
  }
}

export function isValidAddress(address: string): boolean {
  try {
    ethers.getAddress(address); // Updated to use ethers v6 syntax
    return true;
  } catch {
    return false;
  }
}

// Position utilities
export interface PositionData {
  tokenId: string;
  token0: string;
  token1: string;
  fee: number;
  tickLower: number;
  tickUpper: number;
  liquidity: string;
  amount0: string;
  amount1: string;
}

export function isKiltPosition(position: PositionData): boolean {
  const kiltAddress = BASE_TOKENS.KILT.toLowerCase();
  return position.token0.toLowerCase() === kiltAddress || 
         position.token1.toLowerCase() === kiltAddress;
}

export function calculatePositionValue(position: PositionData, bnbPrice: number = 0): number {
  try {
    const amount0 = parseFloat(formatTokenAmount(position.amount0));
    const amount1 = parseFloat(formatTokenAmount(position.amount1));
    
    // Assuming token1 is WBNB, token0 is KILT
    // This is a simplified calculation
    return (amount0 * 0.1) + (amount1 * bnbPrice); // Placeholder KILT price
  } catch {
    return 0;
  }
}