import { combineReducers } from 'redux';
import list from './list';
import status from './status';
import cont from './cont';
import error from './error';

export default combineReducers( {
	list,
	status,
	cont,
	error
} );
