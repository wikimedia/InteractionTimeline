import { createSelector } from 'reselect';
import moment from 'moment';

export const getStartDate = createSelector(
	state => state.query.startDate,
	( startDate ) => startDate ? moment.unix( startDate ) : null
);

export const getEndDate = createSelector(
	state => state.query.endDate,
	( endDate ) => endDate ? moment.unix( endDate ) : null
);
