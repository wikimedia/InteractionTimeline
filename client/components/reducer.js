import { useReducer } from 'react';
import PropTypes from 'prop-types';
import ReducerContext from '../context/reducer';

const initialState = {
	locale: '',
	query: {
		user: [],
		wiki: '',
	},
	wikis: [],
};

function locacleReducer( state, action ) {
	switch(action.type) {
		case 'LOCALE_SET':
			return action.locale;
		default:
			return state;
	}
}

function queryReducer( state, action ) {
	switch ( action.type ) {
		case 'QUERY_WIKI_CHANGE':
			return {
				...state,
				wiki: action.wiki,
			};
		case 'QUERY_USER_CHANGE':
			return {
				...state,
				// Ensure there are no duplicates and that there are only 2.
				user: [ ...( new Set( action.users ) ) ].slice( 0, 2 ),
			};
		default:
			return state;
	}
}

function wikiReducer( state, action ) {
	switch ( action.type ) {
		case 'WIKIS_SET':
			return [ ...action.wikis.reduce( (map, wiki) => map.set(wiki.id, wiki), new Map()).values() ];
		default:
			return state;
	}
}


function reducer( state, action ) {
	return {
		...state,
		locale: locacleReducer( state.locale, action ),
		query: queryReducer( state.query, action ),
		wikis: wikiReducer( state.wikis, action ),
	};
}

function Reducer( { children } ) {
	const [ state, dispatch ] = useReducer( reducer, initialState );

	return (
		<ReducerContext.Provider value={[ state, dispatch ]}>
			{children}
		</ReducerContext.Provider>
	);
}

Reducer.propTypes = {
	children: PropTypes.node.isRequired,
};

export default Reducer;
