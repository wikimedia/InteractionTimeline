import React from 'react';
import PropTypes from 'prop-types';
import { Message } from '@wikimedia/react.i18n';
import REGEX_EDIT_SUMMARY_PARTS from './edit-summary-parts';

const Comment = ( { comment, commentHidden } ) => {
	if ( commentHidden ) {
		return (
			<em>
				<del>
					<Message id="revision-edit-summary-removed" />
				</del>
			</em>
		);
	}

	const matches = comment.match( REGEX_EDIT_SUMMARY_PARTS );

	// return edit summary without section name or empty
	if ( matches[ 2 ] ) {
		return (
			<em>
				{matches[ 2 ].trim()}
			</em>
		);
	}

	return null;
};

Comment.propTypes = {
	comment: PropTypes.string.isRequired,
	commentHidden: PropTypes.bool.isRequired
};

export default Comment;
