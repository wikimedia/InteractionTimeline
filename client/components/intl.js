import { useReducer, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { IntlProvider } from '@wikimedia/react.i18n';
import { getDir } from 'language-data';
import messages from '../utils/messages';

function reducer( state, action ) {
	switch ( action.type ) {
		case 'LOCALE_SET':
			return {
				...state,
				locale: action.locale,
			};
		default:
			throw new Error( 'Unknown Action' );
	}
}

function Intl( { children, locale } ) {
	// The initial state, is whatever comes from the server, or the default prop.
	const [ state, dispatch ] = useReducer( reducer, { locale } );

	// Set the locale from the user's browser.
	// @TODO Allow the user to set their language and set a cookie(?)
	useEffect( () => {
		/* global navigator */
		dispatch( {
			type: 'LOCALE_SET',
			locale: navigator.language,
		} );
	}, [] );

	const dir = useMemo( () => getDir( state.locale.split( '-' ).shift() ), [ state.locale ] );

	return (
		<IntlProvider locale={state.locale} messages={messages}>
			<div lang={state.locale} dir={dir}>
				{children}
			</div>
		</IntlProvider>
	);
}

Intl.propTypes = {
	children: PropTypes.node.isRequired,
	locale: PropTypes.string,
};

Intl.defaultProps = {
	// If a locale is not provided from the server, use English as the default.
	locale: 'en',
};

export default Intl;
