import { OrderedMap } from 'immutable';

export default ( state = new OrderedMap(), action ) => {
	switch ( action.type ) {
		case 'REVISIONS_DELETE':
			return state.deleteAll( action.revisions.keySeq() );
		case 'REVISIONS_SET':
			return action.revisions;
		default:
			return state;
	}
};
