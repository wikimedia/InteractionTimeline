import { useMemo, useContext } from 'react';
import ReducerContext from '../../context/reducer';
import Status from './status';

function StatusContainer() {
	const [ state ] = useContext( ReducerContext );

	// @TODO Perhaps this should be moved into the reducer?
	const status = useMemo( () => {
		if ( state.status === 'done' && state.revisions.length === 0 ) {
			return 'noresults';
		}

		if ( state.status === 'notready' ) {
			if ( state.query.wiki && state.query.user.length < 2 ) {
				return 'nousers';
			}

			if ( !state.query.wiki && state.query.user.length >= 2 ) {
				return 'nowiki';
			}
		}

		return state.status;
	}, [
		state.revisions,
		state.query.wiki,
		state.query.user,
		state.status,
	] );

	return (
		<Status
			status={status}
		/>
	);
}

export default StatusContainer;
