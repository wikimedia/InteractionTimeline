import React from 'react';
import PropTypes from 'prop-types';
import jQuery from 'jquery'; // Load jQuery for jQuery.i18n
import 'jquery.i18n/src/jquery.i18n';
import 'jquery.i18n/src/jquery.i18n.messagestore';

class IntlProvider extends React.Component {
	constructor( props ) {
		super( props );

		jQuery.i18n( {
			locale: props.locale
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
