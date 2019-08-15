import React from 'react';
import PropTypes from 'prop-types';
import { Message } from '@wikimedia/react.i18n';
import RevisionEntity from 'app/entities/revision';
import Header from 'app/components/timeline/header';
import Spinner from 'app/components/timeline/spinner';
import Link from 'app/components/link';

class HeaderRevision extends React.PureComponent {

	componentDidMount() {
		if ( !this.props.revision ) {
			return;
		}

		if ( this.props.revision.meta.status === 'ready' ) {
			this.props.fetchRevision( this.props.revision.id );
		}
	}

	render() {
		if ( !this.props.revision ) {
			return (
				<Header />
			);
		}

		if ( this.props.revision.meta.status === 'ready' ) {
			return (
				<Header href={this.props.url} />
			);
		}

		if ( this.props.revision.meta.status === 'fetching' ) {
			return (
				<Header href={this.props.url} side={this.props.side}>
					<Spinner />
				</Header>
			);
		}

		if ( this.props.revision.meta.status === 'error' ) {
			return (
				<Header href={this.props.url} className="text-center error">
					<Message id="error" /><br />
					{this.props.revision.meta.error.message}
				</Header>
			);
		}

		return (
			<Header href={this.props.url} side={this.props.side} className="text-center">
				<Link href={this.props.url}>
					<i className="mr-2 material-icons">restore</i>
				</Link>
				{this.props.revision.user}<br />
				{this.props.revision.timestamp.format( 'YYYY-MM-DD' )} &mdash; {this.props.revision.timestamp.format( 'HH:mm' )}
			</Header>
		);
	}
}

HeaderRevision.propTypes = {
	fetchRevision: PropTypes.func.isRequired,
	revision: PropTypes.instanceOf( RevisionEntity ),
	url: PropTypes.string,
	side: PropTypes.string
};

HeaderRevision.defaultProps = {
	revision: undefined,
	url: undefined,
	side: undefined
};

export default HeaderRevision;
