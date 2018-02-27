import { connect } from 'react-redux';
import getRevisions from 'app/selectors/revisions';
import { fetchRevisions } from 'app/actions/revisions';
import Timeline from './timeline';

export default connect(
	state => ( {
		empty: getRevisions( state ).isEmpty(),
		status: state.revisions.status
	} ),
	dispatch => ( {
		fetchList: users => dispatch( fetchRevisions( users ) )
	} ),
)( Timeline );
