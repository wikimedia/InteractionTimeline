import { connect } from 'react-redux';
import { toggleDiff } from 'app/actions/diff';
import { makeGetRevisionUrl, makeGetTimestamp } from 'app/selectors/revisions';
import makeGetSide from 'app/selectors/side';
import Revision from './revision';

const getSide = makeGetSide();
const getRevisionUrl = makeGetRevisionUrl();
const getTimestamp = makeGetTimestamp();

export default connect(
	( state, props ) => ( {
		side: getSide( state, props ),
		url: getRevisionUrl( state, props ),
		timestamp: getTimestamp( state, props )
	} ),
	dispatch => ( {
		toggleDiff: revision => dispatch( toggleDiff( revision ) )
	} ),
)( Revision );
