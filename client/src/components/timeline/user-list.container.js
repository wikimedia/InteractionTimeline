import { connect } from 'react-redux';
import UserList from './user-list';

export default connect(
	( state ) => ( {
		users: state.query.user
	} )
)( UserList );
