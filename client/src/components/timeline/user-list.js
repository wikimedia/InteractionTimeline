import React from 'react';
import PropTypes from 'prop-types';
import { Set } from 'immutable';
import UserContaienr from './user.container';

const UserList = ( { users } ) => (
	users.map( ( user ) => (
		<UserContaienr key={user} user={user} />
	) ).toArray()
);

UserList.propTypes = {
	users: PropTypes.instanceOf( Set ).isRequired
};

export default UserList;
