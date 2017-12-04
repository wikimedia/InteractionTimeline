export default ( state = 'notready', action ) => {
	switch ( action.type ) {
		case 'REVISIONS_FETCH':
			return 'fetching';
		case 'REVISIONS_READY':
			return 'ready';
		case 'REVISIONS_NOT_READY':
			return 'notready';
		default:
			return state;
	}
};
