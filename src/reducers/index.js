import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import query from './query';
import wikis from './wikis';

export default combineReducers( {
	router: routerReducer,
	query,
	wikis
} );
