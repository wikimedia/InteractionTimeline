import React from 'react';
import { FormattedMessage } from 'react-intl';
import SelectUsersContainer from 'app/components/fields/select-users.container';
import SelectWikiContainer from 'app/components/fields/select-wiki.container';

const Form = () => (
	<form>
		<div className="form-group">
			<label htmlFor="users"><FormattedMessage id="field-label-users" /></label>
			<SelectUsersContainer id="users" name="user" />
		</div>
		<div className="form-group">
			<label htmlFor="wiki"><FormattedMessage id="field-label-wiki" /></label>
			<SelectWikiContainer id="wiki" name="wiki" />
		</div>
	</form>
);

export default Form;
