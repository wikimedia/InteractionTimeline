import React from 'react';
import PropTypes from 'prop-types';

const User = ( { user, side } ) => {
	const className = [
		'user',
		side,
		'rounded',
		'col-6',
		'border',
		'pt-2',
		'pb-2'
	];

	return (
		<div className={className.join( ' ' )}>
			<div className="d-flex justify-content-center align-items-center">
				<i className="mr-2 material-icons md-48">person</i>
				<span>{user}</span>
			</div>
		</div>
	);
};

User.propTypes = {
	user: PropTypes.string.isRequired,
	side: PropTypes.string.isRequired
};

export default User;
