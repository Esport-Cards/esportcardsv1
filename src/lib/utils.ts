import type { OwnedCard, CardTemplate, Player, PackOpening } from '@prisma/client';

export function getRarityColor(rarity: string): string {
  const colors: Record<string, string> = {
    Common: 'text-rarity-common border-rarity-common',
    Rare: 'text-rarity-rare border-rarity-rare',
    Epic: 'text-rarity-epic border-rarity-epic',
    Legendary: 'text-rarity-legendary border-rarity-legendary',
    Unique: 'text-rarity-unique border-rarity-unique',
  };
  return colors[rarity] || 'text-gray-400';
}

export function getRarityBg(rarity: string): string {
  const colors: Record<string, string> = {
    Common: 'bg-rarity-common/20 border-rarity-common',
    Rare: 'bg-rarity-rare/20 border-rarity-rare',
    Epic: 'bg-rarity-epic/20 border-rarity-epic',
    Legendary: 'bg-rarity-legendary/20 border-rarity-legendary',
    Unique: 'bg-rarity-unique/20 border-rarity-unique',
  };
  return colors[rarity] || 'bg-gray-500/20 border-gray-500';
}

export function getRarityGradient(rarity: string): string {
  const gradients: Record<string, string> = {
    Common: 'from-gray-400 to-gray-600',
    Rare: 'from-blue-400 to-blue-600',
    Epic: 'from-purple-400 to-purple-600',
    Legendary: 'from-yellow-400 to-amber-600',
    Unique: 'from-red-400 to-red-600',
  };
  return gradients[rarity] || 'from-gray-400 to-gray-600';
}

export function getRarityGlow(rarity: string): string {
  const glows: Record<string, string> = {
    Common: 'shadow-gray-500/20',
    Rare: 'shadow-blue-500/30',
    Epic: 'shadow-purple-500/30',
    Legendary: 'shadow-yellow-500/40',
    Unique: 'shadow-red-500/40',
  };
  return glows[rarity] || 'shadow-gray-500/20';
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function generateSerial(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function getRarityWeightedRandom(): string {
  const rand = Math.random() * 100;
  if (rand < 2) return 'Legendary';
  if (rand < 10) return 'Epic';
  if (rand < 30) return 'Rare';
  return 'Common';
}

export const ROLES = ['Captain', 'Flex', 'Entry', 'Support', 'AWP'] as const;
export const GAMES = ['CS2', 'Valorant', 'LoL', 'Dota2'] as const;
export const RARITIES = ['Common', 'Rare', 'Epic', 'Legendary', 'Unique'] as const;

export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
