import { connect } from 'react-redux';
import * as UserActions from 'app/actions/user';
import SelectUsers from './select-users';

export default connect(
	state => ( {
		value: state.users
	} ),
	dispatch => ( {
		onChange: value => dispatch( UserActions.updateUsers( value ) )
	} ),
)( SelectUsers );
