import { createSelector } from 'reselect';
import moment from 'moment';

export const getStartDate = createSelector(
	state => state.query.startDate,
	( startDate ) => startDate ? moment( startDate ) : null
);

export const getEndDate = createSelector(
	state => state.query.endDate,
	( endDate ) => endDate ? moment( endDate ) : null
);
