import { OrderedMap } from 'immutable';

export default ( state = new OrderedMap(), action ) => {
	switch ( action.type ) {
		case 'REVISIONS_SET':
			return action.revisions;
		default:
			return state;
	}
};
