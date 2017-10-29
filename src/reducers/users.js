import { Set } from 'immutable';

export default ( state = new Set(), action ) => {
	switch ( action.type ) {
		case 'USERS_UPDATE':
			return action.users;

		default:
			return state;
	}
};
