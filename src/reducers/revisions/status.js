export default ( state = 'notready', action ) => {
	switch ( action.type ) {
		case 'REVISIONS_FETCH':
			return 'fetching';
		case 'REVISIONS_READY':
			return 'ready';
		case 'QUERY_WIKI_CHANGE':
			if ( !action.wiki ) {
				return 'notready';
			}

			return state;
		case 'QUERY_USER_CHANGE':
			if ( action.users.isEmpty() ) {
				return 'notready';
			}

			return state;
		case 'REVISIONS_NOT_READY':
			return 'notready';
		case 'REVISIONS_DONE':
			return 'done';
		case 'REVISIONS_ERROR':
			return 'error';
		default:
			return state;
	}
};
