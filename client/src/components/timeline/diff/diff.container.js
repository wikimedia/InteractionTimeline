import { connect } from 'react-redux';
import { setDiffShow } from 'app/actions/diff';
import Diff from './diff';

export default connect(
	undefined,
	( dispatch, props ) => ( {
		closeDiff: () => {
			return dispatch( setDiffShow( props.revision, false ) );
		}
	} )
)( Diff );
