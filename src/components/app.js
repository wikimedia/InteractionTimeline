import React from 'react';
import { FormattedMessage } from 'react-intl';
import Form from './form';
import TimelineContainer from './timeline/timeline.container';
import ErrorBoundary from './error-boundary';

export default () => (
	<ErrorBoundary>
		<div className="container-fluid">
			<div className="row justify-content-center">
				<div className="col-xl-10 col-sm-8">
					<div className="row mb-3 align-items-baseline justify-content-between">
						<h2 className="col-sm-auto">
							<FormattedMessage id="app-title" />
						</h2>
						<h6 className="col-sm-auto">
							<FormattedMessage id="app-beta-warning" /> <a href="https://meta.wikimedia.org/wiki/Community_health_initiative/Interaction_Timeline"><FormattedMessage id="app-feedback-link" /></a>
						</h6>
					</div>
					<div className="row mb-3">
						<div className="col">
							<Form />
						</div>
					</div>
				</div>
			</div>
			<div className="row">
				<div className="col">
					<TimelineContainer />
				</div>
			</div>
		</div>
	</ErrorBoundary>
);
