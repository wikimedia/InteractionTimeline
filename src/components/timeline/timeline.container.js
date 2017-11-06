import { connect } from 'react-redux';
import Timeline from './timeline';

export default connect(
	state => ( {
		revisions: state.timeline,
		users: state.query.user
	} )
)( Timeline );
