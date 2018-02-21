import React from 'react';
import 'spinkit/scss/spinners/7-three-bounce.scss';

const Spinner = () => (
	<div className="d-flex align-items-center justify-content-center">
		<div className="sk-three-bounce">
			<div className="sk-child sk-bounce1" />
			<div className="sk-child sk-bounce2" />
			<div className="sk-child sk-bounce3" />
		</div>
	</div>
);

export default Spinner;
