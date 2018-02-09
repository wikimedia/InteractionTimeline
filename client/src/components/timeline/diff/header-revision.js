import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import RevisionEntity from 'app/entities/revision';
import Header from 'app/components/timeline/header';
import Spinner from 'app/components/timeline/spinner';

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

		return (
			<Header href={this.props.url} side={this.props.side} className="text-center">
				{this.props.revision.user}<br />
				{this.props.timestamp.format( 'YYYY-MM-DD' )} &mdash; {this.props.timestamp.format( 'h:mma' )}
			</Header>
		);
	}
}

HeaderRevision.propTypes = {
	fetchRevision: PropTypes.func.isRequired,
	revision: PropTypes.instanceOf( RevisionEntity ),
	url: PropTypes.string,
	timestamp: PropTypes.instanceOf( moment ),
	side: PropTypes.string
};

HeaderRevision.defaultProps = {
	revision: undefined,
	url: undefined,
	timestamp: undefined,
	side: undefined
};

export default HeaderRevision;
