import React from 'react';
import {Composition} from 'remotion';
import {Episode,DURATION,FPS} from './animation/Episode';
import {PixelHorrorEpisode} from './pixel/Episode';
import {HelloNeighbor} from './animation/HelloNeighbor';
export const RemotionRoot:React.FC=()=> <>
 <Composition id="DontLookBehindYou" component={PixelHorrorEpisode} durationInFrames={2250} fps={30} width={1080} height={1920} defaultProps={{showCaptions:true,audioEnabled:true}}/>
 <Composition id="MysteryButton" component={Episode} durationInFrames={DURATION} fps={FPS} width={1080} height={1920} defaultProps={{showCaptions:true,audioEnabled:true}}/>
 <Composition id="HelloNeighbor" component={HelloNeighbor} durationInFrames={450} fps={30} width={1080} height={1920} defaultProps={{showCaptions:true}}/>
</>;
