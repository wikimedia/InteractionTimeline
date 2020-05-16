import { useRef } from 'react';
import PropTypes from 'prop-types';
import UserListContainer from './user-list.container';
import DateRevisions from './date-revisions';
import Status from './status';
import BackToTopButton from './back-top';

function Users() {
	const stickyHeader = useRef();

	return (
		<>
			<div ref={stickyHeader} />
			<div className="row sticky-top">
				<div className="col ml-3 mr-3">
					<div className="row">
						<div className="col-12">
							<div className="row users pr-1 pl-1 justify-content-center">
								<div className="col">
									<div className="row align-items-center justify-content-around text-center">
										<UserListContainer />
									</div>
								</div>
							</div>
						</div>
						<div className="col-1 text-center">
							<BackToTopButton stickyHeader={stickyHeader.current} />
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

function Timeline( { status, empty, fetchList } ) {
	if ( [ 'notready', 'nousers', 'nowiki' ].includes( status ) ) {
		return (
			<div className="timeline">
				<Status status={status} empty={empty} />
			</div>
		);
	}

	if ( empty ) {
		return (
			<div className="timeline">
				<Users />
				<Status status={status} empty={empty} />
			</div>
		);
	}

	return (
		<div className="timeline">
			<Users />
			<DateRevisions status={status} empty={empty} fetchList={fetchList} />
			<Status status={status} empty={empty} />
		</div>
	);
}

Timeline.propTypes = {
	status: PropTypes.oneOf( [ 'notready', 'nousers', 'nowiki', 'ready', 'fetching', 'done', 'error' ] ).isRequired,
	empty: PropTypes.bool.isRequired,
	fetchList: PropTypes.func.isRequired,
};

export default Timeline;
