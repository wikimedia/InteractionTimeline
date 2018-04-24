import React from 'react';
import SelectUsersContainer from 'app/components/fields/select-users.container';
import SelectWikiContainer from 'app/components/fields/select-wiki.container';
import DateRangeContainer from 'app/components/fields/date-range.container';
import { Message } from '@wikimedia/react.i18n';

const Form = () => (
	<form autoComplete="off">

		<div className="row">
			<div className="col-sm-10 offset-sm-1">
				<div className="row">
					<div className="col-sm-8">
						<label htmlFor="users"><Message id="field-label-users" /></label>
						<SelectUsersContainer id="users" name="user" />
					</div>
					<div className="col-sm-4">
						<label htmlFor="wiki"><Message id="field-label-wiki" /></label>
						<SelectWikiContainer id="wiki" name="wiki" />
					</div>
					<div className="col-sm-8 pt-3">
						<DateRangeContainer />
					</div>
				</div>
			</div>
		</div>
	</form>
);

export default Form;
