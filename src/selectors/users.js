import { createSelector } from 'reselect';
import { OrderedSet } from 'immutable';

const getUsers = createSelector(
	state => state.query.user,
	( user = new OrderedSet() ) => user.toArray()
);

export default getUsers;
