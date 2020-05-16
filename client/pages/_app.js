import App, { Container } from 'next/app';
import Head from 'next/head';
import Intl from '../components/intl';

class InteractionTimeline extends App {
	// Uncomment this to enable server-side rendering and get the language as part of the request.
	// static async getInitialProps( { Component, ctx } ) {
	// 	const { req } = ctx;

	// 	// Set the locale from the user's Accept Language header.
	// 	// This prevents a flash of the wrong language or language keys.
	// 	let locale;
	// 	if ( req ) {
	// 		locale = req.headers[ 'accept-language' ].split( ',' ).shift();
	// 	}

	// 	let pageProps = {};
	// 	if ( Component.getInitialProps ) {
	// 		pageProps = await Component.getInitialProps( ctx );
	// 	}

	// 	return { pageProps, locale };
	// }

	render() {
		const { Component, pageProps, locale } = this.props;

		return (
			<Container>
				<Head>
					<link rel="apple-touch-icon-precomposed" sizes="57x57" href="/static/favicons/apple-touch-icon-57x57.png" />
					<link rel="apple-touch-icon-precomposed" sizes="114x114" href="/static/favicons/apple-touch-icon-114x114.png" />
					<link rel="apple-touch-icon-precomposed" sizes="72x72" href="/static/favicons/apple-touch-icon-72x72.png" />
					<link rel="apple-touch-icon-precomposed" sizes="144x144" href="/static/favicons/apple-touch-icon-144x144.png" />
					<link rel="apple-touch-icon-precomposed" sizes="60x60" href="/static/favicons/apple-touch-icon-60x60.png" />
					<link rel="apple-touch-icon-precomposed" sizes="120x120" href="/static/favicons/apple-touch-icon-120x120.png" />
					<link rel="apple-touch-icon-precomposed" sizes="76x76" href="/static/favicons/apple-touch-icon-76x76.png" />
					<link rel="apple-touch-icon-precomposed" sizes="152x152" href="/static/favicons/apple-touch-icon-152x152.png" />
					<link rel="icon" type="image/png" href="/static/favicons/favicon-196x196.png" sizes="196x196" />
					<link rel="icon" type="image/png" href="/static/favicons/favicon-96x96.png" sizes="96x96" />
					<link rel="icon" type="image/png" href="/static/favicons/favicon-32x32.png" sizes="32x32" />
					<link rel="icon" type="image/png" href="/static/favicons/favicon-16x16.png" sizes="16x16" />
					<link rel="icon" type="image/png" href="/static/favicons/favicon-128.png" sizes="128x128" />
					<meta name="msapplication-TileColor" content="#FFFFFF" />
					<meta name="msapplication-TileImage" content="/static/favicons/mstile-144x144.png" />
					<meta name="msapplication-square70x70logo" content="/static/favicons/mstile-70x70.png" />
					<meta name="msapplication-square150x150logo" content="/static/favicons/mstile-150x150.png" />
					<meta name="msapplication-wide310x150logo" content="/static/favicons/mstile-310x150.png" />
					<meta name="msapplication-square310x310logo" content="/static/favicons/mstile-310x310.png" />
				</Head>
				<Intl locale={locale}>
					{/* eslint-disable-next-line react/jsx-props-no-spreading */}
					<Component {...pageProps} />
				</Intl>
			</Container>
		);
	}
}

export default InteractionTimeline;
