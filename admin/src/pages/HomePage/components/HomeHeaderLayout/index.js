import React from 'react';
import Publish from '@strapi/icons/Play';
import Refresh from '@strapi/icons/Refresh';
import { HeaderLayout } from '@strapi/design-system/Layout';
import { Button } from '@strapi/design-system/Button';
import { useReactQuery } from '../../../../hooks/useReactQuery';

export const HomeHeaderLayout = () => {
	const { buildMutations, checkVercelStates } = useReactQuery();

	const handleTriggerBuild = async () => buildMutations.create.mutate();
	const handleCheckVercelStates = async () => checkVercelStates.create.mutate();
	return (
		<HeaderLayout
			primaryAction={
				<Button onClick={handleCheckVercelStates} variant="secondary" startIcon={<Refresh />} size="L">
					Force Check Vercel States
				</Button>
			}
			secondaryAction={
				<Button onClick={handleTriggerBuild} variant="primary" startIcon={<Publish />} size="L">
					Trigger Build
				</Button>
			}
			title="Vercel Website Builder"
			subtitle="The right way to build Vercel websites."
		/>
	);
};
