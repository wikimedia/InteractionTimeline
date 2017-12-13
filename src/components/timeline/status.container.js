import { connect } from 'react-redux';
import { getStatus } from 'app/selectors/status';
import Status from './status';

export default connect(
	state => ( {
		status: getStatus( state )
	} )
)( Status );
