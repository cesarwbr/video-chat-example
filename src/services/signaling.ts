import firebase from "firebase/app";
import "firebase/firestore";
import { CallDescription, Contact } from "../types";

var firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const firestore = firebase.firestore();

export function addICEOfferCandidates(
  callId: string,
  candidate: RTCIceCandidate
) {
  const offerCandidates = firestore.collection(
    `calls/${callId}/offerCandidates`
  );
  offerCandidates.add(candidate.toJSON());
}

export function addICEAnswerCandidates(
  callId: string,
  candidate: RTCIceCandidate
) {
  const answerCandidates = firestore.collection(
    `calls/${callId}/answerCandidates`
  );
  answerCandidates.add(candidate.toJSON());
}

export async function addOfferDescription(
  offer: CallDescription,
  caller: Contact
) {
  const callDoc = firestore.collection("calls").doc();
  callDoc.set({ offer, caller });

  return callDoc.id;
}

export async function addAnswerDescription(
  callId: string,
  answer: CallDescription
) {
  const callDoc = firestore.collection("calls").doc(callId);
  return callDoc.update({ answer });
}

export async function fetchOfferDescription(callId: string) {
  const callDoc = firestore.collection("calls").doc(callId);

  return (await callDoc.get()).data()!.offer as CallDescription;
}

export function onAnswerDescription(
  callId: string,
  callback: (description: RTCSessionDescriptionInit) => void
) {
  const callDoc = firestore.collection("calls").doc(callId);
  callDoc.onSnapshot((snapshot) => {
    const data = snapshot.data();

    if (data?.answer) {
      callback(data.answer as RTCSessionDescriptionInit);
    }
  });
}

export function onAnswer(
  callId: string,
  callback: (iceCandidateInit: RTCIceCandidateInit) => void
) {
  const answerCandidates = firestore.collection(
    `calls/${callId}/answerCandidates`
  );
  answerCandidates.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        callback(change.doc.data() as RTCIceCandidateInit);
      }
    });
  });
}

export function onOffer(
  callId: string,
  callback: (iceCandidateInit: RTCIceCandidateInit) => void
) {
  const answerCandidates = firestore.collection(
    `calls/${callId}/offerCandidates`
  );
  answerCandidates.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        callback(change.doc.data() as RTCIceCandidateInit);
      }
    });
  });
}

export function onCall(callback: (callId: string, caller: Contact) => void) {
  const calls = firestore.collection("calls");
  calls.onSnapshot((snapshot) => {
    const changes = snapshot.docChanges();

    if (changes.length === 1) {
      const change = changes[0];
      const caller = change.doc.data().caller as Contact;
      callback(change.doc.id, caller);
    }
  });
}
