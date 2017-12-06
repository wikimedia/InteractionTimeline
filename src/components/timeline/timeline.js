import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Set, Map } from 'immutable';
import { Observable, Subject } from 'rxjs';
import 'rxjs/add/observable/fromEvent';
import RevisionContainer from './revision.container';
import User from './user';
import Spinner from './spinner';

class Timeline extends React.Component {

	componentDidMount() {
		const doc = this.container.ownerDocument;
		const win = doc.defaultView || doc.parentWindow;

		this.invokeFetch = new Subject();

		// Create the infinite scroll.
		this.infinite = Observable.merge(
			Observable.fromEvent( win, 'scroll' ),
			Observable.fromEvent( win, 'resize' ),
			this.invokeFetch
		)
			.filter( () => !this.props.revisions.isEmpty() )
			.filter( () => this.props.status !== 'done' )
			.debounceTime( 250 )
			.filter( () => this.isBottomVisable( this.container ) )
			.subscribe( () => {
				return this.props.fetchList( new Set( [ this.props.revisions.last().user ] ) );
			} );
	}

	componentDidUpdate() {
		// Attemt to get more revisions if necessary.
		if ( this.invokeFetch ) {
			this.invokeFetch.next();
		}
	}

	componentWillUnmount() {
		this.infinite.unsubscribe();
	}

	getSide( user, users ) {
		let side;

		if ( user === users.first() ) {
			side = 'left';
		} else if ( user === users.last() ) {
			side = 'right';
		}

		return side;
	}

	isBottomVisable( element ) {
		const doc = element.ownerDocument;
		const win = doc.defaultView || doc.parentWindow;
		const rect = element.getBoundingClientRect();
		const offset = 100;
		return ( rect.bottom - offset ) <= ( win.innerHeight || doc.documentElement.clientHeight );
	}

	render() {
		let prev;

		const edits = this.props.revisions.map( ( revision ) => {
			const timestamp = moment( revision.timestamp, moment.ISO_8601 );
			let date;
			let duration;

			if ( !prev || !timestamp.isSame( prev.timestamp, 'day' ) ) {
				date = timestamp;
			}

			const side = this.getSide( revision.user, this.props.users );

			// If we are switching sides, but not the date, show the duraction.
			if ( !date && prev && prev.user !== revision.user ) {
				duration = moment.duration( moment( prev.timestamp, moment.ISO_8601 ).diff( timestamp ) );
			}

			// Set the previous state for
			prev = revision;

			return (
				<RevisionContainer key={revision.id} side={side} date={date} duration={duration} revision={revision} />
			);
		} ).toArray();

		const userDisplay = this.props.users.map( ( user ) => {
			return (
				<User key={user} user={user} side={this.getSide( user, this.props.users )} />
			);
		} ).toArray();

		let status;
		switch ( this.props.status ) {
			case 'fetching':
				status = (
					<Spinner />
				);
				break;
			case 'done':
				if ( this.props.revisions.isEmpty() ) {
					// @TODO Make more comprehensive status messages.
					status = (
						<h3 className="text-center">No Results</h3>
					);
				}
				break;
		}

		return (
			<div className="timeline container-fluid">
				<div className="row justify-content-center">
					<div className="col-xl-10 col-sm-8">
						<div className="row align-items-center justify-content-around mb-3 text-center">
							{userDisplay}
						</div>
					</div>
				</div>
				<div className="edits" ref={( container ) => { this.container = container; }}>
					{edits}
				</div>
				{status}
			</div>
		);
	}
}

Timeline.propTypes = {
	users: PropTypes.instanceOf( Set ).isRequired,
	revisions: PropTypes.instanceOf( Map ).isRequired,
	status: PropTypes.oneOf( [ 'notready', 'ready', 'fetching', 'done' ] ).isRequired,
	fetchList: PropTypes.func.isRequired
};

export default Timeline;
