import React from 'react';
import { FormattedMessage } from 'react-intl';
import SelectUsersContainer from 'app/components/fields/select-users.container';
import SelectWikiContainer from 'app/components/fields/select-wiki.container';
import DatePickerContainer from 'app/components/fields/date-picker.container';

const Form = () => (
	<form>
		<div className="form-group row align-items-center">
			<label className="col-sm-1 col col-form-label" htmlFor="users"><FormattedMessage id="field-label-users" /></label>
			<div className="col">
				<SelectUsersContainer id="users" name="user" />
			</div>
		</div>
		<div className="row">
			<div className="col-sm-6">
				<div className="form-group row align-items-center">
					<label className="col-sm-2 col col-form-label" htmlFor="wiki"><FormattedMessage id="field-label-wiki" /></label>
					<div className="col">
						<SelectWikiContainer id="wiki" name="wiki" />
					</div>
				</div>
			</div>
			<div className="col-sm-6">
				<div className="form-group row align-items-center">
					<label className="col-sm-3 col col-form-label"><FormattedMessage id="field-label-date-range" /></label>
					<div className="col">
						<DatePickerContainer anchorDirection="right" />
					</div>
				</div>
			</div>
		</div>
	</form>
);

export default Form;
