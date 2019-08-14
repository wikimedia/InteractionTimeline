import PropTypes from 'prop-types';
import { useContext } from 'react';
import Head from 'next/head';
import { Message, BananaContext } from '@davidbarratt/react.i18n';
import 'typeface-lato';
import '../styles/styles.scss';
import ErrorBoundary from './error-boundary';

function Layout( { children } ) {
	const banana = useContext( BananaContext );

	return (
		<ErrorBoundary>
			<Head>
				<title>{banana.i18n( 'app-title' )}</title>
				<meta name="application-name" content={banana.i18n( 'app-title' )} />
				<meta name="description" content={banana.i18n( 'app-description' )} />
			</Head>
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
									<a href="https://meta.wikimedia.org/wiki/Community_health_initiative/Interaction_Timeline"><Message id="app-feedback-link" /></a>
								</h6>
							</div>
						</div>
					</div>
				</header>
				{children}
				<footer className="row mt-auto border-top pt-2 pb-2 justify-content-center">
					<div className="col-xl-10 col-sm-8">
						<div className="row align-items-baseline justify-content-between">
							<div className="col-sm-auto">
								<h6>
									<Message
										id="made-by"
										placeholders={[
											<a href="https://meta.wikimedia.org/wiki/Community_health_initiative/The_Team"><Message id="made-by-team" /></a>,
										]}
									/>
								</h6>
								<h6>
									<Message
										id="licensed-under"
										placeholders={[
											<a href="https://www.gnu.org/licenses/gpl-3.0.html">GNU GPLv3</a>,
										]}
									/>
									<span> &ndash; </span>
									<Message
										id="view-source-code-on"
										placeholders={[
											<a href="https://github.com/wikimedia/InteractionTimeline">GitHub</a>,
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
							<div className="col-sm-auto align-self-center">
								<a href="https://tools.wmflabs.org/">
									<img src="https://tools-static.wmflabs.org/toolforge/banners/Powered-by-Toolforge.png" alt={banana.i18n( 'powered-by' )} />
								</a>
							</div>
						</div>
					</div>
				</footer>
			</div>
			{/* <ShareContainer /> */}
		</ErrorBoundary>
	);
}

Layout.propTypes = {
	children: PropTypes.node.isRequired,
};

export default Layout;
