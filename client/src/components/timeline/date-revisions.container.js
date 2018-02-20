import { connect } from 'react-redux';
import getRevisions from 'app/selectors/revisions';
import * as RevisionActions from 'app/actions/revisions';
import DateRevisions from './date-revisions';

export default connect(
	state => ( {
		revisions: getRevisions( state ),
		status: state.revisions.status
	} ),
	dispatch => ( {
		fetchList: users => dispatch( RevisionActions.fetchRevisions( users ) )
	} ),
)( DateRevisions );
