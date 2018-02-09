import { connect } from 'react-redux';
import { makeGetRevisionUrl, makeGetTimestamp } from 'app/selectors/revisions';
import makeGetSide from 'app/selectors/side';
import HeaderRevision from './header-revision';

const getSide = makeGetSide();
const getRevisionUrl = makeGetRevisionUrl();
const getTimestamp = makeGetTimestamp();

export default connect(
	( state, ownProps ) => ( {
		side: getSide( state, ownProps ),
		url: getRevisionUrl( state, ownProps ),
		timestamp: getTimestamp( state, ownProps )
	} )
)( HeaderRevision );
