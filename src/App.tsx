import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import Call from "./components/Call";
import Contacts from "./components/Contacts";
import { onCall } from "./services/signaling";
import { Contact } from "./types";

const CURRENT_USER: Contact = {
  id: `${+new Date()}`,
  name: "Cesar William",
  avatar:
    "https://cesarwilliam.com/_next/image?url=%2Fimages%2Fphoto.png&w=320&q=100",
  createdAt: "1234",
};

function App() {
  const [callContact, setCallContact] = useState<Contact>();
  const [callerInfo, setCallerInfo] =
    useState<{ callId: string; caller: Contact }>();
  const [answerCallId, setAnswerCallId] = useState<string | null>(null);

  useEffect(() => {
    if (callerInfo && callerInfo.caller.id !== CURRENT_USER.id) {
      setAnswerCallId(callerInfo.callId);
      setCallContact(callerInfo.caller);
    }
  }, [callerInfo]);

  useEffect(() => {
    onCall((callId, caller) => {
      setCallerInfo({
        callId,
        caller,
      });
    });
  }, []);

  const handleCall = useCallback((contact: Contact) => {
    setCallContact(contact);
  }, []);

  const handleBackToContacts = useCallback(() => {
    setCallContact(undefined);
  }, []);

  return (
    <div className="App">
      {callContact ? (
        <Call
          answerCallId={answerCallId}
          back={handleBackToContacts}
          contact={callContact}
          currentUser={CURRENT_USER}
        />
      ) : (
        <Contacts call={handleCall} />
      )}
    </div>
  );
}

export default App;
