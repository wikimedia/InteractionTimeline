import { useContext } from 'react';
import ReducerContext from '../../context/reducer';
import UserList from './user-list';

function UserListContainer() {
	const [ state ] = useContext( ReducerContext );

	return (
		<UserList
			users={state.query.user}
		/>
	);
}

export default UserListContainer;
