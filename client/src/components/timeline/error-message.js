import React from 'react';
import PropTypes from 'prop-types';
import { AjaxError } from 'rxjs';
import Message from 'app/components/i18n/message';
import Alert from './alert';

const ErrorMessage = ( { error, clearError } ) => {
	let details;
	let clearButton;
	let code;

	if ( error instanceof AjaxError ) {
		if ( error.response && error.response.error && error.response.error.code ) {
			code = error.response.error.code;
		} else if ( error.status ) {
			code = error.status;
		}

		details = (
			<div>
				<hr />
				<p>
					<Message id="error-message-request-url" /><br />
					<a href={error.request.url} className="alert-link" target="_blank" rel="noopener">
						{error.request.url}
					</a>
				</p>
			</div>
		);
	}

	if ( clearError ) {
		clearButton = (
			<button type="button" className="close" aria-label="Close" onClick={() => clearError()}>
				<span aria-hidden="true">&times;</span>
			</button>
		);
	}

	return (
		<Alert type="error">
			{clearButton}
			<h4 className="alert-heading"><Message id="error" /> {code}</h4>
			<p>{error.message}</p>
			{details}
		</Alert>
	);
};

ErrorMessage.propTypes = {
	error: PropTypes.instanceOf( Error ).isRequired,
	clearError: PropTypes.func
};

ErrorMessage.defaultProps = {
	clearError: null
};

export default ErrorMessage;
