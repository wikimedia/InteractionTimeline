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
						<div className="col-sm-auto">
							<h2><FormattedMessage id="app-title" /></h2>
							{/* @TODO Translate */}
							<h6>Chronologic history for two users on pages where they have both made edits.</h6>
						</div>
						<div className="col-sm-auto">
							<h6>
								<FormattedMessage id="app-beta-warning" /> <a href="https://meta.wikimedia.org/wiki/Community_health_initiative/Interaction_Timeline"><FormattedMessage id="app-feedback-link" /></a>
							</h6>
						</div>
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
