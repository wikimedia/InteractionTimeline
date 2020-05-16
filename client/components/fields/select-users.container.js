import { useContext, useCallback } from 'react';
import ReducerContext from '../../context/reducer';
import SelectUsers from './select-users';

function SelectUsersContainer( props ) {
	const [ state, dispatch ] = useContext( ReducerContext );
	const onChange = useCallback( ( value ) => dispatch( { type: 'QUERY_USER_CHANGE', users: value } ) );

	return (
		<SelectUsers
			{...props} // eslint-disable-line react/jsx-props-no-spreading
			value={state.query.user}
			onChange={onChange}
		/>
	);
}

export default SelectUsersContainer;
