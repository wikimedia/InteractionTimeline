import { connect } from 'react-redux';
import * as TimelineActions from 'app/actions/timeline';
import Timeline from './timeline';

export default connect(
	state => ( {
		revisions: state.timeline
	} ),
	dispatch => ( {
		fetchTimeline: () => dispatch( TimelineActions.fetch() )
	} ),
)( Timeline );
