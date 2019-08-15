import { useContext, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { IntlProvider } from '@wikimedia/react.i18n';
import { getDir } from 'language-data';
import ReducerContext from '../context/reducer';
import messages from '../utils/messages';

function Intl( { children, locale } ) {
	const [ state, dispatch ] = useContext( ReducerContext );

	// Set the locale from the user's browser.
	// @TODO Allow the user to set their language and set a cookie(?)
	//       might need to move this somewhere else.
	useEffect( () => {
		dispatch( {
			type: 'LOCALE_SET',
			locale: navigator.language,
		} );
	}, [] );

	const dir = useMemo( () => getDir( ( state.locale || locale ).split( '-' ).shift() ), [ locale, state.locale ] );

	return (
		<IntlProvider locale={state.locale || locale} messages={messages}>
			<div lang={state.locale || locale} dir={dir}>
				{children}
			</div>
		</IntlProvider>
	);
}

Intl.propTypes = {
	children: PropTypes.node.isRequired,
	locale: PropTypes.string.isRequired,
};

export default Intl;
