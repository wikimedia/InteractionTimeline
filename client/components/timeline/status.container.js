import { useContext } from 'react';
import ReducerContext from '../../context/reducer';
import Status from './status';

function StatusContainer() {
	const [ state ] = useContext( ReducerContext );

	return (
		<Status
			status={state.status}
		/>
	);
}

export default StatusContainer;
