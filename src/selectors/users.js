import { createSelector } from 'reselect';
import { Set } from 'immutable';

const getUsers = createSelector(
	state => state.query.user,
	( user = new Set() ) => user.toArray()
);

export default getUsers;
