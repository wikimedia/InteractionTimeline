import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

class SelectWiki extends React.Component {

	componentDidMount() {
		this.props.fetchOptions();
	}

	render() {
		return (
			<Select {...this.props} />
		);
	}
}

SelectWiki.propTypes = {
	fetchOptions: PropTypes.func.isRequired
};

export default SelectWiki;
