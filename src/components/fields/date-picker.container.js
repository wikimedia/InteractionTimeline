import { connect } from 'react-redux';
import * as QueryActions from 'app/actions/query';
import * as DateSelectors from 'app/selectors/date';
import DatePicker from './date-picker';

export default connect(
	state => ( {
		startDate: DateSelectors.getStartDate( state ),
		endDate: DateSelectors.getEndDate( state )
	} ),
	dispatch => ( {
		onStartDateChange: value => dispatch( QueryActions.setQueryValue( 'startDate', value ? value.utc().toISOString() : null ) ),
		onEndDateChange: value => dispatch( QueryActions.setQueryValue( 'endDate', value ? value.utc().toISOString() : null ) )
	} ),
)( DatePicker );
