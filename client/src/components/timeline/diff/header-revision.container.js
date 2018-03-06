import { connect } from 'react-redux';
import { fetchRevision } from 'app/actions/revisions';
import { makeGetRevisionUrl } from 'app/selectors/revisions';
import makeGetSide from 'app/selectors/side';
import HeaderRevision from './header-revision';

const getSide = makeGetSide();
const getRevisionUrl = makeGetRevisionUrl();

export default connect(
	( state, props ) => ( {
		side: getSide( state, props ),
		url: getRevisionUrl( state, props )
	} ),
	dispatch => ( {
		fetchRevision: id => dispatch( fetchRevision( id ) )
	} ),
)( HeaderRevision );
