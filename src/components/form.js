import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import SelectUsers from './fields/select-users';

const Form = ( { users, updateUsers } ) => (
	<form>
		<div className="form-group">
			<label htmlFor="users"><FormattedMessage id="field-label-users" /></label>
			<SelectUsers id="users" value={users} onChange={updateUsers} name="user" />
		</div>
	</form>
);

Form.propTypes = {
	users: PropTypes.arrayOf( PropTypes.string ).isRequired,
	updateUsers: PropTypes.func.isRequired
};

export default Form;
