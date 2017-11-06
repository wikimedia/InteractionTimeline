import { Map } from 'immutable';

export default ( state = new Map(), action ) => {
	switch ( action.type ) {
		case 'TIMELINE_SET':
			return action.timeline;
		default:
			return state;
	}
};
