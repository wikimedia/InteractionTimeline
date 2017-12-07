import React from 'react';
import PropTypes from 'prop-types';

const Alert = ( { type, children } ) => {
	let icon = type;
	let color = type;

	switch ( type ) {
		case 'error':
			color = 'danger';
			break;
	}

	return (
		<div className="row justify-content-center">
			<div className="col-xl-10 col-sm-8 pl-0 pr-0">
				<div className={`alert alert-${color}`} role="alert">
					<div className="d-flex align-items-top">
						<div>
							<i className="mr-2 material-icons md-48">{icon}</i>
						</div>
						<div>
							{children}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

Alert.propTypes = {
	type: PropTypes.oneOf( [ 'warning', 'error', 'info' ] ).isRequired,
	children: PropTypes.node.isRequired
};

export default Alert;
