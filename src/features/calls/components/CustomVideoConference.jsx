import React from 'react'
import { usePinnedTracks, useTracks, LayoutContextProvider, GridLayout, ParticipantTile, CarouselLayout, FocusLayoutContainer, FocusLayout, ControlBar, RoomAudioRenderer, ConnectionStateToast, useCreateLayoutContext, Chat } from '@livekit/components-react';
import { isEqualTrackRef, isTrackReference, isWeb, log } from '@livekit/components-core';
import { RoomEvent, Track } from 'livekit-client';

const CustomVideoConference = (
  chatMessageFormatter = null,
  SettingsComponent = null
) => {
  const [widgetState, SetWidgetState] = React.useState({
      showChat: false,
      unreadMessages: 0,
      showSettings: false,
  })
  const lastAutoFocusedScreenShareTrack = React.useRef(null);

  const tracks = useTracks(
      [
        { source: Track.Source.Camera, withPlaceholder: true },
        { source: Track.Source.ScreenShare, withPlaceholder: false },
      ],
      { updateOnlyOn: [RoomEvent.ActiveSpeakersChanged], onlySubscribed: false },
    );

  const layoutContext = useCreateLayoutContext();

  const widgetUpdate = (state) => {
    SetWidgetState(state)
  }

  const screenShareTracks = tracks
      .filter(isTrackReference)
      .filter((track) => track.publication.source === Track.Source.ScreenShare);
    
  const focusTrack = usePinnedTracks(layoutContext)?.[0];
  const carouselTracks = tracks.filter((track) => !isEqualTrackRef(track, focusTrack));

  React.useEffect(()=>{
    // 1️⃣ If a screen share is active, but no pin exists yet, auto-pin it
    if (
      screenShareTracks.some((track) => track.publication.isSubscribed) &&
      lastAutoFocusedScreenShareTrack.current === null
    ) {
      log.debug('Auto set screen share focus:', { newScreenShareTrack: screenShareTracks[0] });
      layoutContext.pin.dispatch?.({ msg: 'set_pin', trackReference: screenShareTracks[0] });
      lastAutoFocusedScreenShareTrack.current = screenShareTracks[0];
    }

    // 2️⃣ If a previously pinned screen share no longer exists, clear the pin
    else if (
      lastAutoFocusedScreenShareTrack.current &&
      !screenShareTracks.some(
        (track) =>
          track.publication.trackSid ===
          lastAutoFocusedScreenShareTrack.current?.publication?.trackSid,
      )
    ) {
      log.debug('Auto clearing screen share focus.');
      layoutContext.pin.dispatch?.({ msg: 'clear_pin' });
      lastAutoFocusedScreenShareTrack.current = null;
    }

    // 3️⃣ If the focus track reference got stale (not a valid track reference anymore), fix it
    // Track objects are not stable — LiveKit may recreate or replace them internally whenever the participant reconnects, switches devices, or re-publishes media.
    // The focusTrack you pinned earlier might point to an old object, even if the participant is still there. If you keep a stale reference, the pinned video could disappear or stop updating.
    if (focusTrack && !isTrackReference(focusTrack)) {
      const updatedFocusTrack = tracks.find(
        (tr) =>
          tr.participant.identity === focusTrack.participant.identity &&
          tr.source === focusTrack.source,
      );
      if (updatedFocusTrack !== focusTrack && isTrackReference(updatedFocusTrack)) {
        layoutContext.pin.dispatch?.({ msg: 'set_pin', trackReference: updatedFocusTrack });
      }
    }

  }, [
    // 🔄 Dependencies: rerun effect when screen share list or focus changes
    screenShareTracks
      .map((ref) => `${ref.publication.trackSid}_${ref.publication.isSubscribed}`)
      .join(), // => "TR123_true,TR456_false"
    focusTrack?.publication?.trackSid,
    tracks,
  ])

  // LiveKit’s UI components (like <VideoConference />, <ParticipantTile />, etc.) depend on a default stylesheet from:
  // import '@livekit/components-styles';
  // So, during render, LiveKit checks:
  // “Is our CSS loaded?”
  // useWarnAboutMissingStyles();
  

  return (
      <div className="lk-video-conference">
        {isWeb() && (
          <LayoutContextProvider
            value={layoutContext}
            // onPinChange={handleFocusStateChange}
            onWidgetChange={widgetUpdate}
          >
            <div className="lk-video-conference-inner">
              {!focusTrack ? (
                <div className="lk-grid-layout-wrapper">
                  <GridLayout tracks={tracks}>
                    <ParticipantTile />
                  </GridLayout>
                </div>
              ) : (
                <div className="lk-focus-layout-wrapper">
                  <FocusLayoutContainer>
                    <CarouselLayout tracks={carouselTracks}>
                      <ParticipantTile />
                    </CarouselLayout>
                    {focusTrack && <FocusLayout trackRef={focusTrack} />}
                  </FocusLayoutContainer>
                </div>
              )}
              <ControlBar controls={{ chat: true, settings: !!SettingsComponent }} />
            </div>
            <Chat
              style={{ display: widgetState.showChat ? 'grid' : 'none' }}
              messageFormatter={chatMessageFormatter}
            />
            {SettingsComponent && (
              <div
                className="lk-settings-menu-modal"
                style={{ display: widgetState.showSettings ? 'block' : 'none' }}
              >
                <SettingsComponent />
              </div>
            )}
          </LayoutContextProvider>
        )}
        <RoomAudioRenderer />
        <ConnectionStateToast />
      </div>
    );
}

export default CustomVideoConference