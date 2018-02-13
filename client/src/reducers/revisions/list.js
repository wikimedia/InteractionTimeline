import { OrderedMap } from 'immutable';

export default ( state = new OrderedMap(), action ) => {
	switch ( action.type ) {
		case 'REVISIONS_DELETE':
			return action.revisions.reduce( ( map, revision ) => {
				return map.remove( revision.id );
			}, state );
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
		case 'REVISIONS_DIFF_SET':
			return state.setIn( [ action.id, 'meta', 'diff' ], action.diff );
		case 'REVISIONS_DIFF_SHOW_SET':
			if ( action.show === false && state.get( action.id ).meta.diff.meta.status === 'error' ) {
				// If user is hiding the diff, remove the error. This way the request
				// will be executed the next time the user requests the diff.
				state = state.setIn( [ action.id, 'meta', 'diff', 'meta', 'status' ], 'ready' )
					.setIn( [ action.id, 'meta', 'diff', 'meta', 'error' ], undefined );
			} else if ( action.show === false && state.has( state.get( action.id ).meta.diff.fromrevid ) ) {
				// If the diff was without error, ensure that the from revision is not in
				// error, if it is, remove it.
				if ( state.get( state.get( action.id ).meta.diff.fromrevid ).meta.status === 'error' ) {
					state = state.remove( state.get( action.id ).meta.diff.fromrevid );
				}
			}

			return state.setIn( [ action.id, 'meta', 'diff', 'meta', 'show' ], action.show );
		case 'REVISIONS_DIFF_STATUS_SET':
			return state.setIn( [ action.id, 'meta', 'diff', 'meta', 'status' ], action.status );
		case 'REVISIONS_DIFF_ERROR':
			return state
				.setIn( [ action.id, 'meta', 'diff', 'meta', 'status' ], 'error' )
				.setIn( [ action.id, 'meta', 'diff', 'meta', 'error' ], action.error );
		case 'REVISIONS_SINGLE_ERROR':
			return state
				.setIn( [ action.id, 'meta', 'status' ], 'error' )
				.setIn( [ action.id, 'meta', 'error' ], action.error );
		default:
			return state;
	}
};
