import React from 'react';
import PropTypes from 'prop-types';
import { Tr, Td } from '@strapi/design-system/Table';
import { Typography, IconButton, Flex } from '@strapi/design-system';
import { Trash, ExternalLink } from '@strapi/icons';
import { useReactQuery } from '../../../hooks/useReactQuery';

const LogTableRow = ({ log }) => {
	const { id, status, trigger, vercelDeploymentUid, vercelStatus, vercelStatusUpdatedAt, vercelUrl, vercelAlias, createdAt } = log;
	const { buildLogMutations } = useReactQuery();

	const handleBuildLogDelete = async (id) => {
		try {
			await buildLogMutations.delete.mutate({ id });
		} catch (error) {
			console.error(error);
		}
	};

	const handleOpenExternalLink = (url) => {
    window.open( 'https://' + url, '_blank' );
  };

	const isSuccessFullBuild = status >= 200 && 400 > status;

	const vercelStatusStyle = (status) => {
		switch (status) {
			case 'BUILDING':
			case 'INITIALIZING':
			case 'QUEUED':
				return 'warning500';

			case 'ERROR':
			case 'CANCELED':
				return 'danger500';

			case 'READY':
				return 'success500';

			default:
				return 'neutral900';
		}
	}

	return (
		<Tr>
			<Td>
				<Typography textColor="neutral900">{id}</Typography>
			</Td>
			<Td>
				<Typography textColor={isSuccessFullBuild ? 'success500' : 'danger500'}>
					{isSuccessFullBuild ? 'TRIGGERED' : 'ERROR'} ({status})
				</Typography>
			</Td>
			<Td>
				<Typography textColor="neutral900">{trigger}</Typography>
			</Td>
			<Td>
				<Typography textColor="neutral900">{createdAt}</Typography>
			</Td>
			<Td>
				<Typography textColor="neutral900">{vercelDeploymentUid}</Typography>
			</Td>
			<Td>
				<Typography textColor={vercelStatusStyle(vercelStatus)}>{isSuccessFullBuild ? vercelStatus : ''}</Typography>
			</Td>
			<Td>
				<Typography textColor="neutral900">{vercelStatusUpdatedAt}</Typography>
			</Td>
			<Td>
				<Flex>
					<IconButton
						onClick={() => handleBuildLogDelete(id)}
						label="Delete"
						noBorder
						icon={<Trash />}
					/>
					{!!(vercelUrl) ? 
						<IconButton
							onClick={() => handleOpenExternalLink(vercelUrl)}
							label="Go to Vercel Url"
							noBorder
							icon={<ExternalLink />}
						/>
					: ''}
					{!!(vercelAlias) ? 
						<IconButton
							onClick={() => handleOpenExternalLink(vercelAlias)}
							label="Go to Vercel Alias"
							noBorder
							icon={<ExternalLink />}
						/>
					: ''}
				</Flex>
			</Td>
		</Tr>
	);
};

LogTableRow.propTypes = {
	log: PropTypes.shape({
		id: PropTypes.string.isRequired,
		status: PropTypes.number.isRequired,
		trigger: PropTypes.string.isRequired,
		vercelStatus: PropTypes.string,
		vercelStatusUpdatedAt: PropTypes.string,
		vercelUrl: PropTypes.string,
		vercelAlias: PropTypes.string,
		createdAt: PropTypes.string.isRequired,
	}).isRequired,
};

export { LogTableRow };
