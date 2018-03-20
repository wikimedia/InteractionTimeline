import { connect } from 'react-redux';
import { startDateChange, endDateChange } from 'app/actions/query';
import { getStartDate, getEndDate } from 'app/selectors/date';
import DateRange from './date-range';

export default connect(
	state => ( {
		startDate: getStartDate( state ),
		endDate: getEndDate( state )
	} ),
	dispatch => ( {
		onStartDateChange: value => dispatch( startDateChange( value ? value.utc().unix().toString() : undefined ) ),
		onEndDateChange: value => dispatch( endDateChange( value ? value.utc().endOf( 'day' ).unix().toString() : undefined ) )
	} ),
)( DateRange );
