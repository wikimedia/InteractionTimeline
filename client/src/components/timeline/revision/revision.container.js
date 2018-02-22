import { connect } from 'react-redux';
import { toggleDiff } from 'app/actions/diff';
import { makeGetDiff, makeGetDiffUrl } from 'app/selectors/diff';
import { makeGetRevisionUrl, makeGetTimestamp } from 'app/selectors/revisions';
import makeGetSide from 'app/selectors/side';
import Revision from './revision';

const getSide = makeGetSide();
const getDiffUrl = makeGetDiffUrl();
const getTimestamp = makeGetTimestamp();
const getDiff = makeGetDiff();

export default connect(
	( state, props ) => ( {
		side: getSide( state, props ),
		url: getDiffUrl( state, props ),
		timestamp: getTimestamp( state, props ),
		diff: getDiff( state, props )
	} ),
	dispatch => ( {
		toggleDiff: ( diff, suppressed ) => dispatch( toggleDiff( diff, suppressed ) )
	} ),
)( Revision );
