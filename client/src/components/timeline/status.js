import React from 'react';
import PropTypes from 'prop-types';
import Message from 'app/components/i18n/message';
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
			message = (
				<Alert type="info">
					<Message id="info-required-fields" />
				</Alert>
			);
			break;
		case 'nowiki':
			message = (
				<Alert type="info">
					<Message id="info-no-wiki" />
				</Alert>
			);
			break;
		case 'nousers':
			message = (
				<Alert type="info">
					<Message id="info-no-users" />
				</Alert>
			);
			break;
		case 'noresults':
			message = (
				<Alert type="warning">
					<Message id="warning-no-results" />
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
