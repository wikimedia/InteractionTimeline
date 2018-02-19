import { connect } from 'react-redux';
import makeGetSide from 'app/selectors/side';
import User from './user';

const getSide = makeGetSide();

export default connect(
	( state, props ) => ( {
		side: getSide( state, props )
	} )
)( User );
