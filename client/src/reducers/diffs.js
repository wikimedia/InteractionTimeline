import { Map } from 'immutable';
import Diff from 'app/entities/diff';

export default ( state = new Map(), action ) => {
	switch ( action.type ) {
		case 'REVISIONS_ADD':
		case 'REVISIONS_SINGLE_ADD':
			return action.revisions.reduce( ( map, revision ) => {
				if ( map.has( revision.id ) ) {
					return map;
				}

				return map.set( revision.id, new Diff( {
					torevid: revision.id,
					touser: revision.user
				} ) );
			}, state );
		case 'DIFFS_SET':
			return state.set( action.diff.torevid, action.diff );
		case 'DIFFS_SHOW_SET':
			if ( action.show === false && action.diff.meta.status === 'error' ) {
				// If user is hiding the diff, remove the error. This way the request
				// will be executed the next time the user requests the diff.
				state = state.set( action.diff.torevid,
					action.diff.setIn( [ 'meta', 'status' ], 'ready' )
						.setIn( [ 'meta', 'error' ], undefined )
				);
			}

			return state.setIn( [ action.diff.torevid, 'meta', 'show' ], action.show );
		case 'DIFFS_STATUS_SET':
			return state.setIn( [ action.diff.torevid, 'meta', 'status' ], action.status );
		case 'DIFFS_THROW_ERROR':
			return state
				.setIn( [ action.diff.torevid, 'meta', 'status' ], 'error' )
				.setIn( [ action.diff.torevid, 'meta', 'error' ], action.error );
		case 'QUERY_WIKI_CHANGE':
			return new Map();
		case 'QUERY_USER_CHANGE':
			return state.filter( diff => {
				return action.users.includes( diff.touser );
			} );
		default:
			return state;
	}
};
