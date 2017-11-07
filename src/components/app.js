import React from 'react';
import { FormattedMessage } from 'react-intl';
import Form from './form';
import TimelineContainer from './timeline/timeline.container';

export default () => (
	<div className="container">
		<div className="row mb-3">
			<div className="col">
				<h2><FormattedMessage id="app-title" /></h2>
				<h6>
					<FormattedMessage id="app-beta-warning" /> <a href="https://meta.wikimedia.org/wiki/Community_health_initiative/Interaction_Timeline">
						<FormattedMessage id="app-feedback-link" />
					</a>
				</h6>
			</div>
		</div>
		<div className="row mb-3">
			<div className="col">
				<Form />
			</div>
		</div>
		<div className="row">
			<div className="col">
				<TimelineContainer />
			</div>
		</div>
	</div>
);
