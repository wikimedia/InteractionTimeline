import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import users from './users';
import wiki from './wiki/index';

export default combineReducers( {
	router: routerReducer,
	users,
	wiki
} );
