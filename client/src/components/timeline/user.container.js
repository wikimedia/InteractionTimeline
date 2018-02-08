import { connect } from 'react-redux';
import * as WikiSelectors from 'app/selectors/wiki';
import makeGetSide from 'app/selectors/side';
import User from './user';

const getSide = makeGetSide();

export default connect(
	( state, ownProps ) => ( {
		wiki: WikiSelectors.getWiki( state ),
		side: getSide( state, ownProps )
	} ),
)( User );
