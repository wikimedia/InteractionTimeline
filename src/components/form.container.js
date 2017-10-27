import { connect } from 'react-redux';
import * as UserActions from 'app/actions/user';
import Form from './form';

export default connect(
	state => ( {
		users: state.users
	} ),
	dispatch => ( {
		updateUsers: value => dispatch( UserActions.updateUsers( value ) )
	} ),
)( Form );
