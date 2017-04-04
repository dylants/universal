import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { dispatchToPage1 } from '../../actions/page.actions';

import style from './page2.container.scss';

function Page2(props) {
  return (
    <div>
      <h1 className={style.heading}>Page2</h1>
      <input
        className={style.button}
        type="submit"
        onClick={props.dispatchToPage1}
        value="Dispatch to Page 1"
      />
    </div>
  );
}

Page2.propTypes = {
  dispatchToPage1: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    dispatchToPage1,
  }, dispatch);
}

export default connect(
  null,
  mapDispatchToProps,
)(Page2);
