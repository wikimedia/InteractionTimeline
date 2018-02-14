import { connect } from 'react-redux';
import * as RevisionsActions from 'app/actions/revisions';
import Diff from './diff';

export default connect(
	undefined,
	( dispatch, props ) => ( {
		closeDiff: () => {
			return dispatch( RevisionsActions.setDiffShow( props.id, props.diff, false ) );
		}
	} )
)( Diff );
