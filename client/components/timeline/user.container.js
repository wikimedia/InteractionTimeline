import { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import ReducerContext from '../../context/reducer';
import User from './user';

function UserContaienr( { user } ) {
	const [ state ] = useContext( ReducerContext );

	const wiki = useMemo( () => {
		if ( !state.query.wiki ) {
			return undefined;
		}

		return state.wikis.find( ( { id } ) => id === state.query.wiki );
	}, [
		state.query.wiki,
		state.wikis,
	] );

	const side = useMemo( () => {
		if ( user === state.query.user[ 0 ] ) {
			return 'left';
		}

		if ( user === state.query.user[ 1 ] ) {
			return 'right';
		}

		return undefined;
	}, [
		state.query.user,
		user,
	] );

	return (
		<User
			user={user}
			wiki={wiki}
			side={side}
		/>
	);
}

UserContaienr.propTypes = {
	user: PropTypes.string.isRequired,
};

export default UserContaienr;
