import {
    UniswapPair
} from '@sommelier/shared-types';

export interface AllPairsState {
    isLoading: boolean;
    pairs: UniswapPair[] | null,
    lookups: {
        [pairId: string]:
        UniswapPair & { volumeRanking: number, liquidityRanking: number }
    } | null,
    byLiquidity: UniswapPair[] | null
}

export type Provider = 'metamask';

export interface Wallet {
    account: string;
    provider: Provider
}