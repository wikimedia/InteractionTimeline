import { Map } from 'immutable';

export default ( state = new Map(), action ) => {
	switch ( action.type ) {
		case 'WIKIS_SET':
			return action.wikis;
		case 'WIKIS_SET_NAMESPACES':
			return state.setIn( [ action.id, 'namespaces' ], action.namespaces );
		default:
			return state;
	}
};
