import { useMemo, useEffect } from 'react';
import {
  ConsoleLogger,
  // DefaultDeviceController,
  DefaultMeetingSession,
  LogLevel,
  MeetingSessionConfiguration,
} from 'amazon-chime-sdk-js';

import { useChimeDevices } from '@chime/devices';

type useChimeSessionProps = {
  meeting: any;
  attendee: any;
  logName?: string;
  logLevel?: LogLevel;
};

// https://github.com/aws/amazon-chime-sdk-js/blob/27d5881134d0e5bdf2411d9e79714393eddc74b5/guides/03_API_Overview.md
export const useChimeSession = ({
  meeting,
  attendee,
  logName = 'ChimeSessionLogger',
  logLevel = LogLevel.OFF,
}: useChimeSessionProps) => {
  const configuration = useMemo(
    () => new MeetingSessionConfiguration(meeting, attendee),
    [attendee, meeting]
  );

  const { deviceController } = useChimeDevices();

  const logger = useMemo(() => new ConsoleLogger(logName, logLevel), [
    logName,
    logLevel,
  ]);

  const meetingSession = useMemo(() => {
    return new DefaultMeetingSession(configuration, logger, deviceController);
  }, [configuration, deviceController, logger]);

  useEffect(() => {
    meetingSession.audioVideo.start();

    return () => {
      meetingSession.audioVideo.stop();
    };
  }, [meetingSession.audioVideo]);

  const result = useMemo(
    () => ({
      meetingSession,
      deviceController,
      start: () => {
        meetingSession.audioVideo.start();
      },
      stop: () => {
        meetingSession.audioVideo.stop();
      },
    }),
    [deviceController, meetingSession]
  );
  return result;
};
