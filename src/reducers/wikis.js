import { Map } from 'immutable';

export default ( state = new Map(), action ) => {
	switch ( action.type ) {
		case 'WIKIS_SET':
			return action.wikis;
		default:
			return state;
	}
};
