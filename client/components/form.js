import React from 'react';
import { Message } from '@wikimedia/react.i18n';
import SelectUsersContainer from './fields/select-users.container';
import SelectWikiContainer from './fields/select-wiki.container';
// import DateRangeContainer from './fields/date-range.container';

function Form() {
	return (
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
					{/* <DateRangeContainer /> */}
				</div>
			</div>
		</form>
	);
}

export default Form;
