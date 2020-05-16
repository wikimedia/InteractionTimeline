import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Message } from '@wikimedia/react.i18n';
import 'material-design-icons/iconfont/material-icons.css';

class ErrorBoundary extends PureComponent {
	constructor( props ) {
		super( props );
		this.state = {
			error: null,
		};

		this.handleRefresh = this.handleRefresh.bind( this );
	}

	componentDidCatch( error ) {
		this.setState( {
			error,
		} );
	}

	handleRefresh() {
		const doc = this.refreshLink.ownerDocument;
		const win = doc.defaultView || doc.parentWindow;

		return win.location.reload( true );
	}

	render() {
		const { children } = this.props;
		const { error } = this.state;
		if ( error === null ) {
			return children;
		}

		const report = (
			<a href="https://phabricator.wikimedia.org/project/board/3156/" target="_blank" rel="noopener noreferrer">
				<Message id="error-help-report" />
			</a>
		);

		const refresh = (
			<button
				type="button"
				className="btn btn-link p-0"
				ref={( refreshLink ) => { this.refreshLink = refreshLink; }}
				onKeyPress={this.handleRefresh}
				onClick={this.handleRefresh}
			>
				<Message id="error-help-refresh" />
			</button>
		);

		return (
			<div className="error d-flex align-items-center justify-content-center">
				<div className="container text-center">
					<i className="text-danger material-icons md-48">error_outline</i>
					<h1><Message id="error" /></h1>
					<p>{error.message}</p>
					<p><Message id="error-help" placeholders={[ report, refresh ]} /></p>
				</div>
			</div>
		);
	}
}

ErrorBoundary.propTypes = {
	children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
