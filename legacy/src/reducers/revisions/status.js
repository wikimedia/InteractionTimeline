export default ( state = 'notready', action ) => {
	switch ( action.type ) {
		case 'REVISIONS_FETCHING':
			return 'fetching';
		case 'REVISIONS_READY':
			return 'ready';
		case 'QUERY_WIKI_CHANGE':
			if ( !action.wiki ) {
				return 'notready';
			}

			return state;
		case 'QUERY_USER_CHANGE':
			if ( action.users.count() < 2 ) {
				return 'notready';
			}

			return state;
		case 'REVISIONS_NOT_READY':
			return 'notready';
		case 'REVISIONS_DONE':
			return 'done';
		case 'REVISIONS_ERROR':
			return 'error';
		case 'REVISIONS_ADD':
			return action.cont === false ? 'done' : 'ready';
		default:
			return state;
	}
};
