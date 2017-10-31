import React from 'react';
import { FormattedMessage } from 'react-intl';
import SelectUsersContainer from 'app/components/fields/select-users.container';
import SelectWikiContainer from 'app/components/fields/select-wiki.container';
import DatePickerContainer from 'app/components/fields/date-picker.container';

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
		<div className="form-group">
			<label><FormattedMessage id="field-label-date-range" /></label>
			<div>
				<DatePickerContainer />
			</div>
		</div>
	</form>
);

export default Form;
