/* eslint-env browser */
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import { createEpicMiddleware } from 'redux-observable';
import { composeWithDevTools } from 'redux-devtools-extension';
import 'intersection-observer'; // Pollyfill
import moment from 'moment';
import { IntlProvider } from '@wikimedia/react.i18n';
import i18n from './i18n.dir';
import App from './src/components/app';
import reducer from './src/reducers/index';
import epic from './src/epics/index';
import './styles/styles.scss';

function main() {
	// Setup i18n data.
	const fileNames = Object.keys( i18n );
	const locale = navigator.language;

	// Create a messages object.
	const messages = fileNames.reduce( ( m, name ) => {
		m[ name.replace( /.json$/g, '' ) ] = {
			...i18n[ name ].src
		};

		return m;
	}, {} );

	// Set the language globally for moment.
	moment.locale( locale );

	// Create a history of your choosing (we're using a browser history in this case)
	const history = createHistory();
	// Build the middleware for intercepting and dispatching navigation actions
	const router = routerMiddleware( history );
	const epicMiddleware = createEpicMiddleware( epic );
	// Add the reducer to your store on the `router` key
	// Also apply our middleware for navigating
	const store = createStore(
		reducer,
		composeWithDevTools( applyMiddleware( router, epicMiddleware ) ),
	);

	ReactDOM.render(
		<Provider store={store}>
			<ConnectedRouter history={history}>
				<IntlProvider locale={locale} messages={messages}>
					<App />
				</IntlProvider>
			</ConnectedRouter>
		</Provider>,
		document.getElementById( 'root' ),
	);
}

// Engage!
main();
