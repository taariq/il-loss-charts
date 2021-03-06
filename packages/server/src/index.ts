import 'common/env';
import Server from 'common/server';
import WebsocketServer from 'ws/server';
import routes from 'routes';

import config from 'config';

function startServer() {
    const port = parseInt(config.port);

    const server = new Server().router(routes);
    server.listen(port);

    if (!server.httpServer) {
        throw new Error(
            `Did not successfully initialize http server on startup.`
        );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const wsServer = new WebsocketServer(server.httpServer);
}

if (require.main === module) {
    startServer();
}

export default Server;

// Other exports for other packages

import UniswapFetcher from 'services/uniswap';
import { calculateMarketStats } from 'util/calculate-stats';

export { UniswapFetcher, calculateMarketStats };
