import React from 'react';
import PropTypes from 'prop-types';
// Load jQuery for jQuery.i18n
import jQuery from 'jquery';
// @see https://github.com/wikimedia/jquery.i18n/issues/159
import 'cldrpluralruleparser/src/CLDRPluralRuleParser';
import 'jquery.i18n/src/jquery.i18n';
import 'jquery.i18n/src/jquery.i18n.messagestore';
import 'jquery.i18n/src/jquery.i18n.fallbacks';
import 'jquery.i18n/src/jquery.i18n.parser';
import 'jquery.i18n/src/jquery.i18n.emitter';
import 'jquery.i18n/src/jquery.i18n.language';
import 'jquery.i18n/src/languages/bs';
import 'jquery.i18n/src/languages/dsb';
import 'jquery.i18n/src/languages/fi';
import 'jquery.i18n/src/languages/ga';
import 'jquery.i18n/src/languages/he';
import 'jquery.i18n/src/languages/hsb';
import 'jquery.i18n/src/languages/hu';
import 'jquery.i18n/src/languages/hy';
import 'jquery.i18n/src/languages/la';
import 'jquery.i18n/src/languages/ml';
import 'jquery.i18n/src/languages/os';
import 'jquery.i18n/src/languages/ru';
import 'jquery.i18n/src/languages/sl';
import 'jquery.i18n/src/languages/uk';

class IntlProvider extends React.Component {
	constructor( props ) {
		super( props );

		jQuery.i18n( {
			// Convert to lowercase.
			// @see https://github.com/wikimedia/jquery.i18n/issues/120
			locale: props.locale.toLowerCase()
		} ).load( props.messages );
	}

	render() {
		return this.props.children;
	}
}

IntlProvider.propTypes = {
	children: PropTypes.node.isRequired,
	locale: PropTypes.string.isRequired,
	messages: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
};

export default IntlProvider;
