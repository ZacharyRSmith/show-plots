/**
 * @module index test suite.
 *
 * @flow
 */
import React from 'react';
import ReactDOM from 'react-dom';
import Show from '.';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Show />, div);
  expect(true).toBe(true);
});
