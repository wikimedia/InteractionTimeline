import React from 'react';
import PropTypes from 'prop-types';
import { AjaxError } from 'rxjs';
import Alert from './alert';

const ErrorMessage = ( { error, clearError } ) => {
	// @TODO Translate
	let heading = 'Error';
	let details;
	let clearButton;

	if ( error instanceof AjaxError ) {
		if ( error.response && error.response.error && error.response.error.code ) {
			heading = heading + ' ' + error.response.error.code;
		} else if ( error.status ) {
			heading = heading + ' ' + error.status;
		}

		// @TODO Translate
		details = (
			<div>
				<hr />
				<p>
					Request URL<br />
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
			<h4 className="alert-heading">{heading}</h4>
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
