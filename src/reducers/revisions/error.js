export default ( state = null, action ) => {
	switch ( action.type ) {
		case 'REVISIONS_ERROR':
			return action.error;
		case 'REVISIONS_ERROR_CLEAR':
			return null;
		default:
			return state;
	}
};
