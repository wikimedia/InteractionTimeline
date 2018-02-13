import { connect } from 'react-redux';
import * as RevisionsActions from 'app/actions/revisions';
import ErrorMessage from 'app/components/timeline/error-message';

export default connect(
	undefined,
	( dispatch, props ) => ( {
		clearError: () => {
			return dispatch( RevisionsActions.setDiffShow( props.id, props.diff, false ) );
		}
	} )
)( ErrorMessage );
