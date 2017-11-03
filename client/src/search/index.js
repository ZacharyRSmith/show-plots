/**
 * @module Search
 *
 * @flow
 */
import type { UpdateShowSelectionT } from '../App';

import React from 'react';
import ObservableComponent from 'rxjs-react-component';
import AutoComplete from 'material-ui/AutoComplete';

const NODE_ENV = String(process.env.NODE_ENV || '');

const Page = {
  getSearch: () => document.querySelector('#search')
};

declare type PropsT = {
  updateShowSelection: UpdateShowSelectionT
};
declare type StateT = {
  shows: Object[],
  query: string
};

class Search extends ObservableComponent<PropsT, StateT> {
  state = {
    shows: []
  };

  constructor(props: PropsT) {
    super(props);
    (this: Object).handleShowSelect = this.handleShowSelect.bind(this);
  }

  componentDidMount() {
    const search = Page.getSearch();
    if (search) search.focus();
  }

  handleShowSelect(showWrapper: string | ShowWrapperT) {
    const show = typeof showWrapper === 'string'
      ? this.state.shows[0]
      : showWrapper.data;
    if (!show) return;
    this.props.updateShowSelection({ show });
  }

  updateSearch$(subject: rxjs$Subject<string>) { // ENHANCE: cache
    subject.debounceTime(100)
      .distinctUntilChanged()
      .switchMap(query => fetch(`/api/search?query=${query}`, { accept: 'application/json' })
        .then(res => res.ok ? res.json() : null)
        .catch(err => {
          if (NODE_ENV === 'development') console.error('err', err);
        }))
      .filter(i => !!i)
      .subscribe(shows => {
        this.setState({ shows: shows.map(show => ({ data: show, text: show.name, value: <div></div>})) });
      })
    return subject.map(() => ({})); // rxjs-react-component requires a `return subject.map(// returns object)`
  }

  render() {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', ...(this.props.style || {}) }}>
        <div style={{ backgroundColor: 'aliceblue', borderRadius: '12px', display: 'flex', justifyContent: 'center', opacity: '0.95', width: '300px' }}>
          <AutoComplete
            dataSource={this.state.shows}
            filter={AutoComplete.noFilter}
            hintText="Search by show title"
            id="search"
            onNewRequest={this.handleShowSelect}
            onUpdateInput={this.updateSearch$}
            openOnFocus={true}
          />
        </div>
      </div>
    );
  }
}

export default Search;
