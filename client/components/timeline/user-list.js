import React from 'react';
import PropTypes from 'prop-types';
import UserContainer from './user.container';

function UserList( { users } ) {
	return users.map( ( user ) => (
		<UserContainer key={user} user={user} />
	) );
}

UserList.propTypes = {
	users: PropTypes.arrayOf( PropTypes.string ).isRequired,
};

export default UserList;
