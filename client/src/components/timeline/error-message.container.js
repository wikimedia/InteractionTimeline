import { connect } from 'react-redux';
import * as RevisionsActions from 'app/actions/revisions';
import ErrorMessage from './error-message';

export default connect(
	state => ( {
		error: state.revisions.error
	} ),
	dispatch => ( {
		clearError: () => dispatch( RevisionsActions.clearError() )
	} )
)( ErrorMessage );
