export default ( state = [], action ) => {
	switch ( action.type ) {
		case 'USERS_UPDATE':
			return action.users;

		default:
			return state;
	}
};
