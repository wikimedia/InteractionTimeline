import { connect } from 'react-redux';
import Timeline from './timeline';

export default connect(
	state => ( {
		empty: state.revisions.list.isEmpty(),
		status: state.revisions.status
	} )
)( Timeline );
