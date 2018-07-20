import React from 'react';
import SelectUsersContainer from 'app/components/fields/select-users.container';
import SelectWikiContainer from 'app/components/fields/select-wiki.container';
import DateRangeContainer from 'app/components/fields/date-range.container';
import { Message } from '@wikimedia/react.i18n';

const Form = () => (
	<form autoComplete="off">
		<div className="form-group row align-items-center">
			<label className="col-sm-1 col col-form-label" htmlFor="users"><Message id="field-label-users" /></label>
			<div className="col">
				<SelectUsersContainer id="users" name="user" />
			</div>
		</div>
		<div className="row">
			<div className="col-sm-6">
				<div className="form-group row align-items-center">
					<label className="col-sm-2 col col-form-label" htmlFor="wiki"><Message id="field-label-wiki" /></label>
					<div className="col">
						<SelectWikiContainer id="wiki" name="wiki" />
					</div>
				</div>
			</div>
			<div className="col-sm-6">
				<DateRangeContainer />
			</div>
		</div>
	</form>
);

export default Form;
