import { OrderedMap } from 'immutable';

export default ( state = new OrderedMap(), action ) => {
	switch ( action.type ) {
		case 'REVISIONS_ADD':
		case 'REVISIONS_SINGLE_ADD':
			return state
				.merge( action.revisions )
				// Since the ids are all from the same wiki, they are in a guaranteed
				// order from oldest to newest.
				.sortBy( revision => revision.id );
		case 'REVISIONS_SINGLE_STATUS_SET':
			if ( state.has( action.id ) ) {
				return state.setIn( [ action.id, 'meta', 'status' ], action.status );
			}

			return state;
		case 'REVISIONS_SET':
			return action.revisions.sortBy( revision => revision.id );
		case 'QUERY_WIKI_CHANGE':
		case 'QUERY_START_DATE_CHANGE':
		case 'QUERY_END_DATE_CHANGE':
			return new OrderedMap();
		case 'QUERY_USER_CHANGE':
			return state.filter( revision => {
				return action.users.includes( revision.user );
			} );
		case 'DIFFS_SHOW_SET':
			if ( action.show === false && action.diff.fromrevid && state.has( action.diff.fromrevid ) ) {
				// If the diff was without error, ensure that the from revision is not in
				// error, if it is, remove it.
				if ( state.get( action.diff.fromrevid ).meta.status === 'error' ) {
					state = state.remove( action.diff.fromrevid );
				}
			}

			return state;
		case 'REVISIONS_SINGLE_ERROR':
			return state
				.setIn( [ action.id, 'meta', 'status' ], 'error' )
				.setIn( [ action.id, 'meta', 'error' ], action.error );
		default:
			return state;
	}
};
