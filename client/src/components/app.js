import React from 'react';
import { Helmet } from 'react-helmet';
import { Message } from '@wikimedia/react.i18n';
import Form from './form';
import ShareContainer from './share/share.container';
import TimelineContainer from './timeline/timeline.container';
import ErrorBoundary from './error-boundary';

export default () => (
	<ErrorBoundary>
		<Helmet>
			{/*
				* Start loading the webfont.
				* We lazy-load the web font in JavaScript because CSS blocks rendering.
				*
				* If Server Side Rendering (SSR) is enabled, this will need to be
				* updated by setting rel="preload" on the server and changing to
				* rel="stylesheet" on the client.
				*
				* @see https://wikimedia.github.io/WikimediaUI-Style-Guide/visual-style_typography.html
				*/}
			<link href="https://tools-static.wmflabs.org/fontcdn/css?family=Lato:300,300italic,400,400italic,700,700italic" rel="stylesheet" type="text/css" />
		</Helmet>
		<div className="container app d-flex flex-column">
			<header className="row pt-2 pb-2 mb-3 justify-content-center header">
				<div className="col-xl-10 col-sm-8">
					<div className="row align-items-baseline justify-content-between">
						<div className="col-sm-6">
							<h1><Message id="app-title" /></h1>
							<p><Message id="app-description" /></p>
							<p>
								<Message id="app-beta-warning" /> <a href="https://meta.wikimedia.org/wiki/Community_health_initiative/Interaction_Timeline"><Message id="app-feedback-link" /></a>
							</p>
						</div>
					</div>
				</div>
			</header>
			<div className="row justify-content-center form pt-3">
				<div className="col-xl-12 col-sm-8">
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
			<footer className="row mt-auto pt-2 pb-2 justify-content-center">
				<div className="col-xl-10 col-sm-8">
					<div className="row align-items-baseline justify-content-between">
						<div className="col-sm-auto align-self-left">
							<a href="https://tools.wmflabs.org/">
								<img className="toolforge-logo" src="https://tools-static.wmflabs.org/toolforge/banners/Powered-by-Toolforge.png" alt={Message( { id: 'powered-by' } )} />
							</a>
						</div>
						<div className="col-sm-auto text-right">
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
								<a href="https://phabricator.wikimedia.org/project/board/3156/">
									<Message id="report-bug" />
								</a>
							</h6>
						</div>
					</div>
				</div>
			</footer>
		</div>
		<ShareContainer />
	</ErrorBoundary>
);
