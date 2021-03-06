import { useEffect, SyntheticEvent } from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import BigNumber from 'bignumber.js';

import { IUniswapPair, MarketStats } from '@sommelier/shared-types';

import { MarketData } from 'constants/prop-types';
import { formatUSD } from 'util/formats';
import mixpanel from 'util/mixpanel';
import {ErrorBoundary} from 'react-error-boundary';
import { resolveLogo } from 'components/token-with-logo';
import { ComponentError } from 'components/page-error';

function OverviewContainer({
    marketData,
}: {
    marketData: MarketStats[] | null;
}): JSX.Element {
    useEffect(() => {
        mixpanel.track('pageview:market', {});
    }, []);

    (window as any).marketData = marketData;

    return (
        <div>
            <h4 className='heading-main'>
                Highest Impermanent Loss Pairs on Uniswap*
            </h4>
            <p className='info-well'>
                *The impermanent loss percentage is a reflection of the amount
                of IL due to price fluctation relative to the total return of
                the pool. Data since December 1.
            </p>
            {marketData && (
                <ErrorBoundary FallbackComponent={ComponentError}>
                    <MarketDataTable data={marketData} />
                </ErrorBoundary>
            )}
        </div>
    );
}

function MarketDataTable({ data }: { data: MarketStats[] }) {
    const history = useHistory();

    const formatPair = ({ id, token0, token1 }: IUniswapPair) => {
        return (
            <span>
                {resolveLogo(token0.id)}{' '}
                <span className='market-data-pair-span'>
                    <Link to={`/pair?id=${id}`}>
                        {token0.symbol}/{token1.symbol}
                    </Link>
                </span>{' '}
                {resolveLogo(token1.id)}
            </span>
        );
    };

    const formatPct = (val: number) =>
        `${new BigNumber(val).times(100).toFixed(2)}%`;

    const columns = [
        {
            dataField: 'index',
            text: '#',
            sort: true,
        },
        {
            dataField: 'market',
            text: 'Market',
            formatter: formatPair,
        },
        {
            dataField: 'impermanentLoss',
            text: 'Impermanent Loss %',
            sort: true,
            formatter: formatPct,
        },
        {
            dataField: 'ilGross',
            text: 'Impermanent Loss',
            sort: true,
            formatter: formatUSD,
        },
        {
            dataField: 'liquidity',
            text: 'USD Liquidity',
            sort: true,
            formatter: formatUSD,
        },
        {
            dataField: 'volume',
            text: 'USD Volume',
            sort: true,
            formatter: formatUSD,
        },
        {
            dataField: 'returnsUSD',
            text: 'USD Returns',
            sort: true,
            formatter: formatUSD,
        },
        {
            dataField: 'returnsETH',
            text: 'ETH Returns',
            sort: true,
            formatter: (val: BigNumber) => val.toFixed(4),
        },
    ];

    const sortedIl = [...data]
        .sort((a, b) => a.impermanentLoss - b.impermanentLoss)
        .map((d, index) => ({
            ...d,
            index: index + 1,
            market: { id: d.id, token0: d.token0, token1: d.token1 },
        }));

    (window as any).sortedIL = sortedIl;

    const onRowClick = (e: SyntheticEvent, pair: IUniswapPair) => {
        history.push(`/pair?id=${pair.id}`);
    };

    return (
        <>
            <hr />
            <div className='il-market-container'>
                <BootstrapTable
                    headerClasses='market-data-table-header'
                    rowClasses='market-data-table-row'
                    keyField='index'
                    data={sortedIl}
                    columns={columns}
                    rowStyle={{ borderLeft: 0, borderRight: 0 }}
                    bordered={false}
                    condensed={true}
                    rowEvents={{ onClick: onRowClick }}
                />
            </div>
        </>
    );
}

MarketDataTable.propTypes = {
    data: PropTypes.arrayOf(MarketData),
};

export default OverviewContainer;
