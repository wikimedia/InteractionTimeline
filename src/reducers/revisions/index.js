import { combineReducers } from 'redux';
import list from './list';
import status from './status';

export default combineReducers( {
	list,
	status
} );
