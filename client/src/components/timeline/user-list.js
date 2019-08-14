import React from 'react';
import PropTypes from 'prop-types';
import { Set } from 'immutable';
import UserContainer from './user.container';

const UserList = ( { users } ) => (
	users.map( ( user ) => (
		<UserContainer key={user} user={user} />
	) ).toArray()
);

UserList.propTypes = {
	users: PropTypes.instanceOf( Set ).isRequired
};

export default UserList;
