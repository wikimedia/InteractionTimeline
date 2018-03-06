import React from 'react';
import PropTypes from 'prop-types';
import 'material-design-icons/iconfont/material-icons.css';

const Alert = ( { type, children } ) => {
	let icon = type;
	let color = type;

	if ( type === 'error' ) {
		color = 'danger';
	}

	return (
		<div className={`alert alert-${color}`} role="alert">
			<div className="row align-items-top">
				<div className="col-auto pr-0">
					<i className="mr-2 material-icons">{icon}</i>
				</div>
				<div className="col">
					{children}
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
