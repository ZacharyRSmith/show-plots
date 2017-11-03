/**
 * @module Show
 */
// @flow
import React, { Component } from 'react';
import flatten from 'lodash/flatten';
import range from 'lodash/range';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

import Episode from './Episode';
import { getGraphHeight, getPointHeight } from './utilities';
import seasons from '../graph/scaffoldData';
import { fJSON } from '../utilities/fetch';

declare type PropsT = {
  show: ShowT
};

declare type StateT = {
  seasons: SeasonT[]
};

const leftPadding = '10px';

class Show extends Component {
  state = {
    isTrendView: true,
    seasons
  };

  constructor(props: PropsT) {
    super(props);
    (this: Object).toggleView = this.toggleView.bind(this);
  }

  componentDidUpdate(prevProps: PropsT, prevState: StateT) {
    if (prevProps.show !== this.props.show) this.fetchSeasons();
    // ENHANCE animate scroll
    if (prevState.seasons !== this.state.seasons) document.documentElement.scrollIntoView(true);
  }

  fetchSeasons() {
    fJSON(`/api/episode-ratings?title=${this.props.show.name}`)
      .then(seasons => {
        this.setState({ seasons: seasons || [] })
      });
  }

  toggleView() {
    // e.preventDefault();
    this.setState(prevState => ({ isTrendView: !prevState.isTrendView }));
  }

  render() {
    // ENHANCE: transitions
    // FIXME height, scrolling episodes over search
    // FIXME array item keys
    // TODO if click on trend view, change to detail view
    // TODO indicate clickable better
    // ENHANCE: button to scroll right
    // ENHANCE: color
    const { show } = this.props;
    const { isTrendView } = this.state;
    const numEpisodes = flatten(this.state.seasons.map(season => season.Episodes)).length;
    // ENHANCE instead of toggle button, have checkbox or something to better indicate state

    return(
      <div style={this.props.style ? this.props.style : {}}>
{/*        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {show && <RaisedButton disabled label={show.name} />}
          <RaisedButton label={isTrendView ? "Detail view" : "Trend view"} onClick={this.toggleView} />
        </div>
        {show && <RaisedButton disabled label='Click an episode to see more' />}*/}
        <div id='toolbar-container' style={{ flexDirection: 'row', justifyContent: 'center', marginTop: '16px', position: 'fixed', width: '100%', zIndex: 1 }}>
          <Toolbar id='toolbar' style={{ backgroundColor: 'aliceblue', borderRadius: '12px', opacity: '0.95' }}>
            <ToolbarGroup style={{ backgroundColor: 'aliceblue' }}>
              <ToolbarTitle text={show.name} />
              <ToolbarSeparator style={{ marginRight: '24px' }} />
              <RadioButtonGroup
                onChange={(e, val) => this.setState({ isTrendView: val === 'trend' })}
                valueSelected={this.state.isTrendView ? 'trend' : 'details'}
              >
                <RadioButton
                  label="Trend"
                  value="trend"
                />
                <RadioButton
                  label="Details"
                  value="details"
                />
              </RadioButtonGroup>
              <ToolbarSeparator style={{ marginRight: '24px' }} />
              Click on episodes when in<br/>
              "Details" view to see more
            </ToolbarGroup>
          </Toolbar>
        </div>
        <div id="toolbar-container--responsive" style={{ justifyContent: 'center', marginTop: '16px', position: 'fixed', width: '100%', zIndex: 1 }}>
          <div style={{ alignItems: 'center', backgroundColor: 'aliceblue', borderRadius: '12px', display: 'flex', flexDirection: 'column', opacity: 0.95, padding: '16px' }}>
            <ToolbarTitle style={{ lineHeight: '20px' }} text={show.name} />
            <hr style={{ width: '100%' }}/>
            <RadioButtonGroup
              onChange={(e, val) => this.setState({ isTrendView: val === 'trend' })}
              style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
              valueSelected={this.state.isTrendView ? 'trend' : 'details'}
            >
              <RadioButton
                className="view-toggler__button"
                label="Trend"
                style={{ width: 'auto' }}
                value="trend"
              />
              <RadioButton
                label="Details"
                style={{ width: 'auto' }}
                value="details"
              />
            </RadioButtonGroup>
            <hr style={{ width: '100%' }}/>
            Click on episodes when in<br/>
            "Details" view to see more
          </div>
        </div>
        <div id="graph" style={{ height: `${getGraphHeight()}px`, marginTop: '16px', padding: `0 ${leftPadding}`, position: 'relative' }}>
        {isTrendView && <div style={{ color: 'white', position: 'absolute', top: '-20px' }}>Episode Ratings</div>}
        {!isTrendView
        ?
        null
        :
        range(0, 10).map(i => (
          <div className='line' style={{
            height: '1px',
            backgroundColor: 'white',
            color: 'white',
            top: (i * getPointHeight()) + 'px',
            position: 'relative'
          }}>{`${String(10 - i)}/10`}</div>
        ))}
          <div
            className={isTrendView ? 'clickable' : ''}
            onClick={isTrendView ? this.toggleView : () => {}}
            style={{ display: 'flex', flexDirection: 'row', height: '100%', left: leftPadding, position: 'absolute', top: 0 }}
          >
            {this.state.seasons.map(season =>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              {season.Episodes.map(episode =>
              <Episode
                episode={episode}
                isTrendView={isTrendView}
                numEpisodes={numEpisodes}
                season={season}
              />
              )}
            </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Show;
