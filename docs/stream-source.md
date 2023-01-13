# Stream Source

## About

This document provides context relating to how the front-end should
display either recorded video streams (mp4) or livestreams (HLS format
videos, .m3u8 for playlist and .ts for video segment).

## Default

Until adding streams is properly implemented as a feature, the streams section of
the sidebar currently contains a hardcoded streams function (hard-coded in
the backend), which contains the url of a livestream.

## Format

Frontend expects livestream files to be in the format "./livestream/output.m3u8".
As of 13/01/2023, this is hardcoded behaviour to only support one HLS livestream
at once.

### Considerations

If we assume there is only ever going to be one client which is going to be
looking at the livestream at any one time, then keeping the same system for
the livestream which is provided live to the frontend client is fine. However,
if it turns out our requirement is that multiple can be looking at the multiple
livestreams, this technical decision needs to be revisited.