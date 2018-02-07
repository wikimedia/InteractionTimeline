import { connect } from 'react-redux';
import * as WikiSelectors from 'app/selectors/wiki';
import * as RevisionActions from 'app/actions/revisions';
import Revision from './revision';

export default connect(
	state => ( {
		wiki: WikiSelectors.getWiki( state )
	} ),
	dispatch => ( {
		toggleDiff: revision => dispatch( RevisionActions.toggleDiff( revision ) )
	} ),
)( Revision );
