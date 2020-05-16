import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Message } from '@wikimedia/react.i18n';
import Alert from './alert';
import Spinner from './spinner';
import ErrorMessageContainer from './error-message.container';

function Status( { status, empty } ) {
	const message = useMemo( () => {
		switch ( status ) {
			case 'fetching':
				return <Spinner />;
			case 'notready':
				return (
					<Alert type="info">
						<Message id="info-required-fields" />
					</Alert>
				);
			case 'nowiki':
				return (
					<Alert type="info">
						<Message id="info-no-wiki" />
					</Alert>
				);
			case 'nousers':
				return (
					<Alert type="info">
						<Message id="info-no-users" />
					</Alert>
				);
			case 'noresults':
				return (
					<Alert type="warning">
						<Message id="warning-no-results" />
					</Alert>
				);
			case 'error':
				return <ErrorMessageContainer />;
			default:
				return null;
		}
	}, [
		status,
	] );

	if ( !message ) {
		return null;
	}

	let className = [
		'status',
		'row',
	];

	if ( !empty ) {
		className = [
			...className,
			'has-content',
		];
	}

	return (
		<div className={className.join( ' ' )}>
			<div className="col">
				<div className="row wrapper mt-3 mb-3">
					<div className="col ml-3 mr-3">
						<div className="row justify-content-center">
							<div className="col-xl-10 col-sm-8 pl-0 pr-0">
								{message}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

Status.propTypes = {
	status: PropTypes.string.isRequired,
	empty: PropTypes.bool.isRequired,
};

export default Status;
