import { connect } from 'react-redux';
import { toggleDiff } from 'app/actions/diff';
import { makeGetDiff, makeGetDiffUrl } from 'app/selectors/diff';
import { makeGetTitle } from 'app/selectors/revisions';
import makeGetSide from 'app/selectors/side';
import Revision from './revision';

const getSide = makeGetSide();
const getTitle = makeGetTitle();
const getDiffUrl = makeGetDiffUrl();
const getDiff = makeGetDiff();

export default connect(
	( state, props ) => ( {
		side: getSide( state, props ),
		url: getDiffUrl( state, props ),
		diff: getDiff( state, props ),
		title: getTitle( state, props )
	} ),
	dispatch => ( {
		toggleDiff: ( diff, suppressed ) => dispatch( toggleDiff( diff, suppressed ) )
	} ),
)( Revision );
