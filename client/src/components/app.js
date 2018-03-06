import React from 'react';
import Message from './i18n/message';
import Form from './form';
import TimelineContainer from './timeline/timeline.container';
import ErrorBoundary from './error-boundary';

export default () => (
	<ErrorBoundary>
		<div className="container-fluid app d-flex flex-column">
			<header className="row border-bottom pt-2 pb-2 mb-3 justify-content-center">
				<div className="col-xl-10 col-sm-8">
					<div className="row align-items-baseline justify-content-between">
						<div className="col-sm-auto">
							<h2><Message id="app-title" /></h2>
							<h6><Message id="app-description" /></h6>
						</div>
						<div className="col-sm-auto">
							<h6>
								<Message id="app-beta-warning" /> <a href="https://meta.wikimedia.org/wiki/Community_health_initiative/Interaction_Timeline"><Message id="app-feedback-link" /></a>
							</h6>
						</div>
					</div>
				</div>
			</header>
			<div className="row justify-content-center">
				<div className="col-xl-10 col-sm-8">
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
			<footer className="row mt-auto border-top pt-2 pb-2 justify-content-center">
				<div className="col-xl-10 col-sm-8">
					<div className="row align-items-baseline justify-content-between">
						<div className="col-sm-auto">
							<h6>
								<Message
									id="made-by"
									placeholders={[
										<a href="https://meta.wikimedia.org/wiki/Community_health_initiative/The_Team"><Message id="made-by-team" /></a>
									]}
								/>
							</h6>
							<h6>
								<Message
									id="licensed-under"
									placeholders={[
										<a href="https://www.gnu.org/licenses/gpl-3.0.html">GNU GPLv3</a>
									]}
								/>
								<span> &ndash; </span>
								<Message
									id="view-source-code-on"
									placeholders={[
										<a href="https://github.com/wikimedia/InteractionTimeline">GitHub</a>
									]}
								/>
								<span> &ndash; </span>
								<a href="https://wikimediafoundation.org/wiki/Privacy_policy"><Message id="privacy-policy" /></a>
								<span> &ndash; </span>
								<a href="https://phabricator.wikimedia.org/maniphest/task/edit/form/1/?projects=Anti-Harassment,InteractionTimeline&title=Interaction%20Timeline%20bug%20report:%20&assign=TBolliger&description=Please%20be%20descriptive%20and%20include%20screenshots%20and%20links%20if%20possible.%20Thank%20you!%20">
									<Message id="report-bug" />
								</a>
							</h6>
						</div>
						<div className="col-sm-auto align-self-center">
							<a href="https://tools.wmflabs.org/">
								<img src="https://tools-static.wmflabs.org/toolforge/banners/Powered-by-Toolforge.png" alt={Message( { id: 'powered-by' } )} />
							</a>
						</div>
					</div>
				</div>
			</footer>
		</div>
	</ErrorBoundary>
);
