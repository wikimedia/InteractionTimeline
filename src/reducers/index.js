import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import query from './query';
import wikis from './wikis';
import revisions from './revisions';

export default combineReducers( {
	router: routerReducer,
	query,
	wikis,
	revisions
} );
