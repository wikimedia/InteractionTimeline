import React from 'react';
import PropTypes from 'prop-types';
import 'material-design-icons/iconfont/material-icons.css';

class ErrorBoundary extends React.Component {

	constructor( props ) {
		super( props );
		this.state = {
			error: null
		};
	}

	componentDidCatch( error ) {
		this.setState( {
			error
		} );
	}

	render() {

		if ( this.state.error ) {
			// You can render any custom fallback UI
			return (
				<div className="error d-flex align-items-center justify-content-center">
					<div className="container text-center">
						<i className="text-danger material-icons md-48">error_outline</i>
						<h1>Error</h1>
						<p>{this.state.error.message}</p>
						<p>
							<a href={`https://phabricator.wikimedia.org/maniphest/task/edit/form/1/?projects=Anti-Harassment&title=Interaction%20Timeline%20Fatal%20Error%3A%20${encodeURIComponent( this.state.error.message )}&assign=TBolliger&description=Error%20Message%3A%0A%3E%20${encodeURIComponent( this.state.error.message )}%0A%0AReproduction%20Steps%3A%0A`}>
								Report Error
							</a>
						</p>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

ErrorBoundary.propTypes = {
	children: PropTypes.node.isRequired
};

export default ErrorBoundary;
