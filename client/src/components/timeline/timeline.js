import React from 'react';
import PropTypes from 'prop-types';
import { Set, Map } from 'immutable';
import { Observable, Subject } from 'rxjs';
import 'rxjs/add/observable/fromEvent';
import UserListContainer from './user-list.container';
import DateRevisions from './date-revisions';
import StatusContainer from './status.container';

class Timeline extends React.Component {

	componentDidMount() {
		const doc = this.container.ownerDocument;
		const win = doc.defaultView || doc.parentWindow;

		this.invokeFetch = new Subject();

		const badStatus = [
			'done',
			'notready'
		];

		// Create the infinite scroll.
		this.infinite = Observable.merge(
			Observable.fromEvent( win, 'scroll' ),
			Observable.fromEvent( win, 'resize' ),
			this.invokeFetch
		)
			.filter( () => !badStatus.includes( this.props.status ) )
			.filter( () => !this.props.revisions.isEmpty() )
			.filter( () => this.isBottomVisable( this.container ) )
			.debounceTime( 250 )
			.subscribe( () => {
				// The debounce delays the immisions so the props may not be the same.
				if ( badStatus.includes( this.props.status ) ) {
					return;
				}

				if ( this.props.revisions.isEmpty() ) {
					return;
				}

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

	isBottomVisable( element ) {
		const doc = element.ownerDocument;
		const win = doc.defaultView || doc.parentWindow;
		const rect = element.getBoundingClientRect();
		const offset = 300;
		return ( rect.bottom - offset ) <= ( win.innerHeight || doc.documentElement.clientHeight );
	}

	render() {
		return (
			<div className="row timeline">
				<div className="col ml-3 mr-3">
					<div className="row pr-1 pl-1 justify-content-center">
						<div className="col-xl-10 col-sm-8">
							<div className="row align-items-center justify-content-around mb-3 text-center">
								{this.props.status !== 'notready' ? <UserListContainer /> : null}
							</div>
						</div>
					</div>
					<div className="row edits" ref={( container ) => { this.container = container; }}>
						<div className="col">
							{this.props.status !== 'notready' ? <DateRevisions revisions={this.props.revisions} /> : null}
						</div>
					</div>
					<StatusContainer />
				</div>
			</div>
		);
	}
}

Timeline.propTypes = {
	revisions: PropTypes.instanceOf( Map ).isRequired,
	status: PropTypes.oneOf( [ 'notready', 'ready', 'fetching', 'done', 'error' ] ).isRequired,
	fetchList: PropTypes.func.isRequired
};

export default Timeline;
