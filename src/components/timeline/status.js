import React from 'react';
import PropTypes from 'prop-types';
import Alert from './alert';
import Spinner from './spinner';
import ErrorMessageContainer from './error-message.container';

const Status = ( { status } ) => {
	switch ( status ) {
		case 'fetching':
			return <Spinner />;
		case 'notready':
			// @TODO Translate
			return (
				<Alert type="info">
					Please provide a user and wiki to begin.
				</Alert>
			);
		case 'nowiki':
			// @TODO Translate
			return (
				<Alert type="info">
					Please provide a wiki to begin.
				</Alert>
			);
		case 'nousers':
			// @TODO Translate
			return (
				<Alert type="info">
					Please provide a user to begin.
				</Alert>
			);
		case 'noresults':
			return (
				<Alert type="warning">
					No Results
				</Alert>
			);
		case 'error':
			return <ErrorMessageContainer />;
		default:
			return null;
	}
};

Status.propTypes = {
	status: PropTypes.string.isRequired
};

export default Status;
