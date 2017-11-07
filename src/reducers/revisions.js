import { OrderedMap } from 'immutable';

export default ( state = new OrderedMap(), action ) => {
	switch ( action.type ) {
		case 'QUERY_UPDATE':
		case 'QUERY_SET_VALUE':
			return new OrderedMap();
		case 'REVISIONS_SET':
			return action.revisions;
		default:
			return state;
	}
};
