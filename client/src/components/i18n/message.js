import PropTypes from 'prop-types';
import jQuery from 'jquery';

const Message = ( { id, placeholders } ) => (
	jQuery.i18n( id, ...placeholders )
);

Message.propTypes = {
	id: PropTypes.string.isRequired,
	placeholders: PropTypes.array // eslint-disable-line react/forbid-prop-types
};

Message.defaultProps = {
	placeholders: []
};

export default Message;
