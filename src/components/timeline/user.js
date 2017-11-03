import React from 'react';
import PropTypes from 'prop-types';

const User = ( { user } ) => (
	<div className="col-lg-3 col-md-4 col border pt-2 pb-2">
		<div className="d-flex justify-content-center align-items-center">
			<i className="mr-2 material-icons md-48">person</i>
			<span>{user}</span>
		</div>
	</div>
);

User.propTypes = {
	user: PropTypes.string.isRequired
};

export default User;
