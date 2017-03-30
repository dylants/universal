import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { loadPage1Data } from '../../actions/page.actions';

class Page1 extends Component {
  static fetchData({ store }) {
    return store.dispatch(loadPage1Data());
  }

  componentDidMount() {
    this.props.loadPage1Data();
  }

  render() {
    const { loading, error, data } = this.props.page1State;

    let renderData;
    if (loading) {
      renderData = (
        <p>Loading...</p>
      );
    } else if (error) {
      renderData = (
        <p>{error}</p>
      );
    } else {
      const { pageNumber } = data;
      renderData = (
        <p>Page Number: {pageNumber}</p>
      );
    }

    return (
      <div>
        <h1>Page1</h1>
        {renderData}
      </div>
    );
  }
}

Page1.propTypes = {
  loadPage1Data: PropTypes.func.isRequired,
  page1State: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.any,
    data: PropTypes.shape({
      pageNumber: PropTypes.number.isRequired,
    }),
  }).isRequired,
};

function mapStateToProps(state) {
  return {
    page1State: state.page1State,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    loadPage1Data,
  }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Page1);
