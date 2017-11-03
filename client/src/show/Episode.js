/**
 * @module <Episode/>
 */
// @flow
import React, { Component } from 'react';

import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

import { getPointHeight } from './utilities';

declare type CirclePropsT = {
  cx: number,
  cy: number,
  r: number,
  stroke?: string,
  strokeWidth?: number
};

declare type PropsT = {
  episode: EpisodeT,
  isTrendView: bool,
  numEpisodes: number,
  season: SeasonT
};

declare type SvgPropsT = {
  className?: string,
  fill?: string,
  height: number,
  onClick?: Function,
  style: {
    position: 'relative',
    top: 0 | string // string of \d+px
  },
  width: number,
  overflow: 'visible'
};

export default class Episode extends Component {
  state = {
   anchorEl: Event,
   isOpen: false
  };

  constructor(props: PropsT) {
   super(props);
   (this: Object).handleClick = this.handleClick.bind(this);
   (this: Object).handleRequestClose = this.handleRequestClose.bind(this);
  }

  handleClick(evt: Event) {
   evt.preventDefault();

   this.setState({ anchorEl: evt.currentTarget, isOpen: true });
  }

  handleRequestClose() {
   this.setState({ isOpen: false });
  }

  render() {
   const { episode, isTrendView, numEpisodes, season } = this.props;
   const { availWidth } = window.screen;
   const appPaddingWidth = 70;
   const episodeWidth = isTrendView
     ? Math.min((availWidth - appPaddingWidth) / numEpisodes, 36) // Math.min() because width when isTrendView shouldn't be larger than when !isTrendView
     : 36;
   const getColorCode = num => ({
     '1': "#E56410",
     '2': "#24E05F",
     '3': "#A572E1",
     '4': "#AA5158",
     // 5: "#23304B", // Too dark for dark background images.
     '5': "#318420"
   }[num] || getColorCode(num - 5));
   const svgProps: SvgPropsT = {
     height: 36,
     style: { position: 'relative', top: episode.imdbRating === 'N/A' ? 0 : `${(episode.imdbRating - 10) * -1 * getPointHeight()}px`},
     width: 36,
     overflow: 'visible'
   };
   episode.imdbRating && episode.imdbRating !== 'N/A' && Object.assign(
     svgProps,
     { fill: getColorCode(season.Season) }
   );
   isTrendView || Object.assign(svgProps, {
     className: 'clickable',
     onClick: this.handleClick
   });
   const circleSize = isTrendView ? 5 : 8;
   const circleProps: CirclePropsT = {
     cx: circleSize,
     cy: circleSize,
     r: circleSize
   };
   if (!episode.imdbRating || episode.imdbRating === 'N/A') {
     Object.assign(
       circleProps,
       {
         stroke: getColorCode(season.Season),
         strokeWidth: 4
       }
     );
   }

   // FIXME details are appearing at top/left before moving
   return (
     <div style={{ width: episodeWidth }}>
       <svg {...svgProps}>
         <circle {...circleProps}/>
       </svg>
       <Dialog
         title={episode.Title}
         actions={[
           <RaisedButton
             label={"Cancel"}
             onClick={() => this.setState({isOpen: false})}
           />,
           <RaisedButton
             keyboardFocused={true}
             label={"See on IMDB"}
             onClick={() => window.open(`http://www.imdb.com/title/${episode.imdbID}`, 'showPlots')}
             primary={true}
           />
         ]}
         modal={false}
         open={this.state.isOpen}
         onRequestClose={() => this.setState({isOpen: false})}
       >
         {JSON.stringify(episode, null, 2)}
       </Dialog>
     </div>
   );
  }
}
