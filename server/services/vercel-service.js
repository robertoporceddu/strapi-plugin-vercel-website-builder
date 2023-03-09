'use strict';

const axios = require('axios').default;
const { getPluginService } = require('../utils/getPluginService');

module.exports = ({ strapi }) => ({
	getDeployHookId(settings) {
		return settings.url.substring(settings.url.lastIndexOf('/') + 1);
	},

	async getFirstEmptyLog(strapi) {
		const logs = await getPluginService(strapi, 'logService').find({
			filters: {
				$and: [
					{
						vercelDeploymentUid: {
							$null: true,
						}
					},
					{
						status: {
							$between: [200, 299],
						}
					}
				]

			},
			sort: {
				createdAt: 'ASC'
			},
			start: 0,
			limit: 1,
		});

		if(logs.length === 1) {
			return {
				...logs[0],
				createdAtTimestamp: new Date(logs[0].createdAt).getTime()
			};
		}
	},

	async getLogToUpdate(strapi) {
		return await getPluginService(strapi, 'logService').find({
			filters: {
				$and: [
					{
						vercelDeploymentUid: {
							$notNull: true,
						}
					},
					{
						vercelStatus: {
							$notIn: ['READY', 'CANCELED', 'ERROR'],
						}
					},
					{
						status: {
							$between: [200, 299],
						}
					}
				]
			},
			sort: {
				createdAt: 'ASC'
			},
			start: 0,
			limit: 10,
		});
	},

	async getVercelDeployments(settings, since) {
		let params = {
				app: settings.vercel.app,
				teamId: settings.vercel.teamId
		};

		if(since) {
			params.since = since;
		}

		const deployments = await axios({
			method: 'GET',
			url: 'https://api.vercel.com/v6/deployments',
			data: {},
			headers: { Authorization: `Bearer ${settings.vercel.accessToken}` },
			params
		});

		return deployments.data.deployments.filter((item) => {
			return item.meta.deployHookId === this.getDeployHookId(settings)
		})
	},

	async getVercelDeploymentStatus(settings, deploymentUid) {
		let params = {
				app: settings.vercel.app,
				teamId: settings.vercel.teamId
		};

		const deployment = await axios({
			method: 'GET',
			url: `https://api.vercel.com/v11/deployments/${deploymentUid}`,
			data: {},
			headers: { Authorization: `Bearer ${settings.vercel.accessToken}` },
			params
		});

		return deployment.data;
	},

	async updateLogs(settings) {
		const logs = await this.getLogToUpdate(strapi);

		await logs.forEach(async(log) =>  {
			const vercelDeploymentStatus = await this.getVercelDeploymentStatus(settings, log.vercelDeploymentUid);

			if(vercelDeploymentStatus) {
				getPluginService(strapi, 'logService').update(log.id, {
					vercelStatus: vercelDeploymentStatus.readyState,
					vercelStatusUpdatedAt: (new Date()).toISOString(),
				});
			}
		});
	},

	async checkEmptyLogs(settings) {
		let log;

		while(log = await this.getFirstEmptyLog(strapi)) {
			const vercelDeployments = await this.getVercelDeployments(settings, log.createdAtTimestamp);

			getPluginService(strapi, 'logService').update(log.id, {
				vercelDeploymentUid: vercelDeployments[vercelDeployments.length - 1].uid,
				vercelStatus: vercelDeployments[vercelDeployments.length - 1].state,
				vercelStatusUpdatedAt: (new Date()).toISOString(),
			});
		}
	},

	async checkStates({ record, settings }) {
		try {
			await this.updateLogs(settings);
			await this.checkEmptyLogs(settings);

			strapi.log.info('[vercel website builder] check vercel states done');
		} catch (error) {
			console.log(error);
		}
	},
});
