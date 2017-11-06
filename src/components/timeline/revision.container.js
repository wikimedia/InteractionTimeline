import { connect } from 'react-redux';
import * as WikiSelectors from 'app/selectors/wiki';
import Revision from './revision';

export default connect(
	state => ( {
		wiki: WikiSelectors.getWiki( state )
	} )
)( Revision );
