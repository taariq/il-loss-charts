import { IUniswapPair } from '@sommelier/shared-types';

import logoMappings from 'constants/trustwallet-mappings.json';
import { Pair } from 'constants/prop-types';

function TokenWithLogo(side: 'left' | 'right'): ({ item: pair }: { item: IUniswapPair }, logoPosition?: string) => JSX.Element {
    const TokenOnGivenSide = (
        { item: pair }: { item: IUniswapPair },
        logoPosition = 'left'
    ) => {
        let token;

        if (side === 'left') token = pair.token0;
        else if (side === 'right') token = pair.token1;
        else throw new Error('Unknown side');

        if (logoPosition === 'left') {
            return (
                <span>
                    {resolveLogo(token.id)} {token.symbol}
                </span>
            );
        } else {
            return (
                <span>
                    {token.symbol} {resolveLogo(token.id)}
                </span>
            );
        }
    };

    TokenOnGivenSide.propTypes = { item: Pair };

    return TokenOnGivenSide;
}


TokenWithLogo.displayName = 'TokenWithLogo';

export function resolveLogo(addressLower?: string): JSX.Element {
    let address: string | undefined = undefined;

    if (addressLower && addressLower in logoMappings) {
        address = logoMappings[addressLower as keyof typeof logoMappings];
    }

    if (!address) return <span>🍇</span>;

    const imgUrl = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`;
    return (
        <span>
            <img style={{ height: '1rem' }} src={imgUrl} alt='🍇' />
        </span>
    );
}

export function PairWithLogo({
    pair: { token0, token1 },
}: {
    pair: IUniswapPair;
}): JSX.Element {
    return (
        <span>
            {resolveLogo(token0.id)}{' '}
            <span className='market-data-pair-span'>
                {token0.symbol}/{token1.symbol}
            </span>{' '}
            {resolveLogo(token1.id)}
        </span>
    );
}

export default TokenWithLogo;
