'use strict';

import { requestPluginEndpoint } from '../utils/requestPluginEndpoint';

const route = 'vercelCheckStates';

const vercelCheckStates = () => {
	return requestPluginEndpoint(route, {
		method: 'GET',
	});
};

export { vercelCheckStates };
