import { connect } from 'react-redux';
import { Set } from 'immutable';
import * as UserActions from 'app/actions/user';
import SelectUsers from './select-users';

export default connect(
	state => ( {
		value: state.users.toArray()
	} ),
	dispatch => ( {
		onChange: value => dispatch( UserActions.updateUsers( new Set( value ) ) )
	} ),
)( SelectUsers );
