import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Message } from '@wikimedia/react.i18n';
import Alert from './alert';

function ErrorMessage( { error, clearError } ) {
	console.log('ERROR', error );
	const code = useMemo( () => {
		if ( error.response && error.response.error && error.response.error.code ) {
			return error.response.error.code;
		}

		if ( error.status ) {
			return error.status;
		}

		return null;
	}, [
		error,
	] );

	const details = useMemo( () => {
		if ( !error.request || !error.request.url ) {
			return null;
		}

		return (
			<div>
				<hr />
				<p>
					<Message id="error-message-request-url" />
					<br />
					<a href={error.request.url} className="alert-link" target="_blank" rel="noopener noreferrer">
						{error.request.url}
					</a>
				</p>
			</div>
		);
	}, [
		error,
	] );

	const clearButton = useMemo( () => {
		if ( !clearError ) {
			return null;
		}

		return (
			<button type="button" className="close" aria-label="Close" onClick={clearError}>
				<span aria-hidden="true">&times;</span>
			</button>
		);
	}, [
		clearError,
	] );

	const message = useMemo( () => {
		if ( !error ) {
			return null;
		}

		if ( error.response && error.response.message ) {
			return error.response.message;
		}

		return error.message;
	}, [
		error,
	] );

	return (
		<Alert type="error">
			{clearButton}
			{/* eslint-disable-next-line react/jsx-one-expression-per-line */}
			<h4 className="alert-heading"><Message id="error" /> {code}</h4>
			<p>{message}</p>
			{details}
		</Alert>
	);
}

ErrorMessage.propTypes = {
	error: PropTypes.instanceOf( Error ).isRequired,
	clearError: PropTypes.func,
};

ErrorMessage.defaultProps = {
	clearError: null,
};

export default ErrorMessage;
