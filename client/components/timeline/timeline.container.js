import { useContext } from 'react';
import ReducerContext from '../../context/reducer';
import Timeline from './timeline';

function TimelineContainer() {
	const [ state ] = useContext( ReducerContext );

	return (
		<Timeline
			empty={state.revisions.length === 0}
			status={state.status}
		/>
	);
}

export default TimelineContainer;
