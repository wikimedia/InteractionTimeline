import { connect } from 'react-redux';
import { fetchRevisions } from 'app/actions/revisions';
import DateRevisions from './date-revisions';

export default connect(
	state => ( {
		revisions: state.revisions.list,
		status: state.revisions.status
	} ),
	dispatch => ( {
		fetchList: () => dispatch( fetchRevisions() )
	} ),
)( DateRevisions );
