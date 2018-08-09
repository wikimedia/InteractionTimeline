import jQuery from 'jquery';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// Add jQuery global.
global.jQuery = jQuery;

// Configure Enzyme
Enzyme.configure( { adapter: new Adapter() } );
