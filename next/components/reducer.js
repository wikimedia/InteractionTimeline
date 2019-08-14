import { useReducer } from 'react';
import PropTypes from 'prop-types';
import ReducerContext from '../context/reducer';

const initialState = {
	locale: '',
};

function reducer( state, action ) {
	switch ( action.type ) {
		case 'LOCALE_SET':
			return {
				...state,
				locale: action.locale,
			};
		default:
			throw new Error( 'Unkown Action' );
	}
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
