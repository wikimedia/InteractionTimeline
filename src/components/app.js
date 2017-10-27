import React from 'react';
import { FormattedMessage } from 'react-intl';
import FormContainer from './form.container';

export default () => (
	<div className="container">
		<div className="row">
			<div className="col">
				<h2><FormattedMessage id="app-title" /></h2>
			</div>
		</div>
		<div className="row">
			<div className="col">
				<FormContainer />
			</div>
		</div>
	</div>
);
