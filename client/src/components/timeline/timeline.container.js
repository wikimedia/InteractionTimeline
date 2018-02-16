import { connect } from 'react-redux';
import getRevisions from 'app/selectors/revisions';
import { fetchRevisions } from 'app/actions/revisions';
import Timeline from './timeline';

export default connect(
	state => ( {
		revisions: getRevisions( state ),
		users: state.query.user,
		status: state.revisions.status,
		wiki: state.query.wiki
	} ),
	dispatch => ( {
		fetchList: users => dispatch( fetchRevisions( users ) )
	} ),
)( Timeline );
