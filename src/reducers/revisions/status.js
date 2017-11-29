export default ( state = 'ready', action ) => {
	switch ( action.type ) {
		case 'REVISIONS_FETCH':
			return 'fetching';
		case 'REVISIONS_READY':
			return 'ready';
		default:
			return state;
	}
};
