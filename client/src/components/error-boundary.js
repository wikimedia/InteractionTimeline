import React from 'react';
import PropTypes from 'prop-types';
import Message from 'app/components/i18n/message';
import 'material-design-icons/iconfont/material-icons.css';

class ErrorBoundary extends React.PureComponent {

	constructor( props ) {
		super( props );
		this.state = {
			error: null
		};

		this.handleRefresh.bind( this );
	}

	handleRefresh() {
		const doc = this.refreshLink.ownerDocument;
		const win = doc.defaultView || doc.parentWindow;

		return win.location.refresh( true );
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
						<h1><Message id="error" /></h1>
						<p>{this.state.error.message}</p>
						<p>
							<a href={`https://phabricator.wikimedia.org/maniphest/task/edit/form/1/?projects=Anti-Harassment&title=Interaction%20Timeline%20Fatal%20Error%3A%20${encodeURIComponent( this.state.error.message )}&assign=TBolliger&description=Error%20Message%3A%0A%3E%20${encodeURIComponent( this.state.error.message )}%0A%0AReproduction%20Steps%3A%0A`}>
								Report the Error
							</a><span>, and then </span>
							<a
								href=""
								ref={( refreshLink ) => { this.refreshLink = refreshLink; }}
								onKeyPress={this.handleRefresh}
								onClick={this.handleRefresh}
							>
								Refresh the Page
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
