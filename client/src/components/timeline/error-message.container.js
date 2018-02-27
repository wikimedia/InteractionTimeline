import { connect } from 'react-redux';
import { clearError } from 'app/actions/revisions';
import ErrorMessage from './error-message';

export default connect(
	state => ( {
		error: state.revisions.error
	} ),
	dispatch => ( {
		clearError: () => dispatch( clearError() )
	} )
)( ErrorMessage );
