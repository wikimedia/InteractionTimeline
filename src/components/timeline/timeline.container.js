import { connect } from 'react-redux';
import getRevisions from 'app/selectors/revisions';
import Timeline from './timeline';

export default connect(
	state => ( {
		revisions: getRevisions( state ),
		users: state.query.user
	} )
)( Timeline );
