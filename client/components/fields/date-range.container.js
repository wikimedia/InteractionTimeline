import { useCallback, useContext } from 'react';
import reducer from '../../context/reducer';
import DateRange from './date-range';

function DateRangeContainer() {
	const [ state, dispatch ] = useContext( reducer );
	const onStartDateChange = useCallback( ( startDate ) => dispatch( { type: 'QUERY_START_DATE_CHANGE', startDate } ) );
	const onEndDateChange = useCallback( ( endDate ) => dispatch( { type: 'QUERY_END_DATE_CHANGE', endDate } ) );

	return (
		<DateRange
			startDate={state.query.startDate}
			endDate={state.query.endDate}
			onStartDateChange={onStartDateChange}
			onEndDateChange={onEndDateChange}
		/>
	);
}

export default DateRangeContainer;
