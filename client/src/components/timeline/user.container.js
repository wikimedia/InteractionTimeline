import { connect } from 'react-redux';
import { getWiki } from 'app/selectors/wiki';
import makeGetSide from 'app/selectors/side';
import User from './user';

const getSide = makeGetSide();

export default connect(
	( state, props ) => ( {
		wiki: getWiki( state ),
		side: getSide( state, props )
	} ),
)( User );
