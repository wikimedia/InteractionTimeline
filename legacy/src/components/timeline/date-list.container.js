import { connect } from 'react-redux';
import { getTimelineRevisions } from 'app/selectors/revisions';
import DateList from './date-list';

export default connect(
	state => ( {
		revisions: getTimelineRevisions( state )
	} )
)( DateList );
