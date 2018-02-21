import React from 'react';
import PropTypes from 'prop-types';
import Alert from './alert';
import Spinner from './spinner';
import ErrorMessageContainer from './error-message.container';

const Status = ( { status } ) => {
	let message;

	switch ( status ) {
		case 'fetching':
			message = <Spinner />;
			break;
		case 'notready':
			// @TODO Translate
			message = (
				<Alert type="info">
					Please provide two users and wiki to begin.
				</Alert>
			);
			break;
		case 'nowiki':
			// @TODO Translate
			message = (
				<Alert type="info">
					Please provide a wiki to begin.
				</Alert>
			);
			break;
		case 'nousers':
			// @TODO Translate
			message = (
				<Alert type="info">
					Please provide two users to begin.
				</Alert>
			);
			break;
		case 'noresults':
			message = (
				<Alert type="warning">
					No Results
				</Alert>
			);
			break;
		case 'error':
			message = <ErrorMessageContainer />;
			break;
		default:
			return null;
	}

	return (
		<div className="row justify-content-center">
			<div className="col-xl-10 col-sm-8 pl-0 pr-0">
				{message}
			</div>
		</div>
	);
};

Status.propTypes = {
	status: PropTypes.string.isRequired
};

export default Status;
