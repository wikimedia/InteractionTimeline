import { Map } from 'immutable';

export default ( state = new Map(), action ) => {
	switch ( action.type ) {
		case 'REVISIONS_CONTINUE_SET':
			return state.set( action.user, action.cont );
		case 'REVISIONS_CONTINUE_DELETE':
			return state.remove( action.user );
		default:
			return state;
	}
};
