import React, { useCallback, useEffect, useRef, useState } from "react";
import { ImPhone, ImPhoneHangUp } from "react-icons/im";
import { useCallStream } from "../hooks/useCallStream";
import { useCallTimer } from "../hooks/useCallTimer";
import { CallStatus, Contact } from "../types";

import "./Call.css";

type Props = {
  back: () => void;
  contact: Contact;
  answerCallId: string | null;
  currentUser: Contact;
};

function Call({ back, contact, answerCallId, currentUser }: Props) {
  const [callStatus, setCallStatus] = useState<CallStatus>(
    CallStatus.CONNECTING
  );
  const [answeredStream, setAnsweredStream] = useState<MediaStream | null>(
    null
  );
  const webcamVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const { callTimer, startTimer, stopTimer } = useCallTimer();
  const {
    onLocalStreamCreated,
    onRemoteStreamCreated,
    onDisconnect,
    answerCall,
  } = useCallStream(currentUser, !!answerCallId);

  useEffect(() => {
    const unsubscribe = onLocalStreamCreated((localStream) => {
      webcamVideo.current!.srcObject = localStream;
      setCallStatus(CallStatus.CALLING);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onRemoteStreamCreated((localStream) => {
      setAnsweredStream(localStream);
      setCallStatus(CallStatus.ANSWERED);
      startTimer();
    });

    return () => {
      unsubscribe();
    };
  }, [startTimer]);

  useEffect(() => {
    const unsubscribe = onDisconnect(() => {
      back();
    });

    return () => {
      unsubscribe();
    };
  }, [back]);

  useEffect(() => {
    if (answeredStream && remoteVideo.current) {
      remoteVideo.current.srcObject = answeredStream;
    }
  }, [answeredStream]);

  useEffect(() => {
    if (callStatus === CallStatus.ANSWERED) {
      startTimer();
    }

    return () => {
      stopTimer();
    };
  }, [callStatus]);

  const handleAnswer = useCallback((answerCallId: string) => {
    answerCall(answerCallId);
    setCallStatus(CallStatus.ANSWERED);
  }, []);

  return (
    <main className="call">
      <div className="call--background">
        {!answeredStream ? (
          <div className="call--background--contact">
            <div className="call--background--contact--image">
              <img className="call--background--media" src={contact?.avatar} />
            </div>
            <span className="call--background--contact--name">
              {contact?.name}
            </span>
          </div>
        ) : (
          <video
            ref={remoteVideo}
            className="call--background--media"
            autoPlay
            playsInline
          />
        )}
      </div>
      <div className="call--overlay">
        <header className="call--overlay--header">
          <span className="call--overlay--header--status">
            {callStatus === CallStatus.CALLING
              ? "Calling..."
              : callStatus === CallStatus.CONNECTING
              ? "Connecting..."
              : callTimer}
          </span>
        </header>
        <div />
        <footer className="call--overlay--footer">
          <section className="call--overlay--footer--yourself">
            <video
              ref={webcamVideo}
              className="call--overlay--footer--yourself--media"
              autoPlay
              playsInline
              controls
              muted={true}
            />
          </section>
          <section className="call--overlay--footer--actions">
            {callStatus === CallStatus.CALLING && answerCallId && (
              <button
                className="call--overlay--footer--button call--overlay--footer--button--answer"
                onClick={() => handleAnswer(answerCallId)}
              >
                <ImPhone />
              </button>
            )}
            <button
              className="call--overlay--footer--button call--overlay--footer--button--hang-up"
              onClick={back}
            >
              <ImPhoneHangUp />
            </button>
          </section>
        </footer>
      </div>
    </main>
  );
}

export default Call;
