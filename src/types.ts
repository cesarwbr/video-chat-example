export type Screen = "contacts" | "call";

export enum CallStatus {
  CALLING = "CALLING",
  ANSWERED = "ANSWERED",
  CONNECTING = "CONNECTING",
}

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  createdAt: string;
}

export interface CallDescription {
  sdp?: string;
  type: RTCSdpType;
}
