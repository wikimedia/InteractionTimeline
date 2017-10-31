import React from 'react';
import { FormattedMessage } from 'react-intl';
import Form from './form/form';

export default () => (
	<div className="container">
		<div className="row">
			<div className="col">
				<h2><FormattedMessage id="app-title" /></h2>
			</div>
		</div>
		<div className="row">
			<div className="col">
				<Form />
			</div>
		</div>
	</div>
);
