import { connect } from 'react-redux';
import Share from './share';

export default connect(
	state => ( {
		empty: state.revisions.list.isEmpty()
	} )
)( Share );
