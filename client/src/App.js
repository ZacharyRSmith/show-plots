/**
 * @module App
 *
 * FIXME attributions to APIs, original ShowPlots devs.
 * @flow
 */
import React, { Component } from 'react';
import get from 'lodash/get';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Search from './search';
import Show from './show';

import theWireBackdrop from './4hWfYN3wiOZZXC7t6B70BF9iUvk.jpg';
import './App.css';

export type UpdateShowSelectionT = ({ show: ShowT }) => void;

declare type PropsT = {};
declare type StateT = {
  show?: ShowT
};

class App extends Component<void, PropsT, StateT> {
  state = {
    show: { name: 'The Wire' }
  };

  constructor(props: PropsT) {
    super(props);
    (this: Object).updateShowSelection = this.updateShowSelection.bind(this);
  }

  updateShowSelection({ show }: { show: ShowT }) {
    this.setState({ show });
  }

  render() {
    const imgSrc = get(this.state.show, 'backdrop_path')
      ? `http://image.tmdb.org/t/p/original/${get(this.state.show, 'backdrop_path')}`
      : null; // TODO? big 4k screens?
    const dimensions = (() => {
      const image = new Image();
      image.src = imgSrc || '';
      const { height, width } = image;
      const { availHeight, availWidth } = window.screen;
      if (!height || !width) return {};
      const multiplier = (() => {
        if (width < availWidth || height < availHeight) {
          // If availWidth is 2x width, and availHeight is 3x height,
          // then multiplier is 3.
          return Math.max(availWidth / width, availHeight / height);
        } else {
          // If width is 2x availWidth, and height is 3x availHeight,
          // then multiplier is 1/2.
          return 1 / Math.min(width / availWidth, height / availHeight);
        }
      })();

      return {
        height: multiplier * height,
        width: multiplier * width
      };
    })();

    return (
      <MuiThemeProvider>
        <div style={{ paddingTop: '80px' }}>

          <img
            alt=""
            onLoad={() => {
              this.forceUpdate()
            }}
            src={imgSrc || theWireBackdrop}
            style={{ ...dimensions, filter: 'blur(3px) brightness(0.5)', left: 0, position: 'fixed', top: 0 }}
            id="bg"

          />
          <Search
            updateShowSelection={this.updateShowSelection}
            style={{ position: 'fixed', top: '30px', width: '100%', zIndex: 1 }}
          />
          <Show
            show={this.state.show}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
