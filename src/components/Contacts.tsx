import React, { useEffect, useState } from "react";
import { FaVideo } from "react-icons/fa";
import { Contact, Screen } from "../types";
import "./Contacts.css";

type Props = {
  call: (contact: Contact) => void;
};

function Contacts({ call }: Props) {
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    async function fetchContacts() {
      const data = await fetch(
        "https://60d77540307c300017a5f8a4.mockapi.io/users"
      );
      const contacts = (await data.json()) as Contact[];

      contacts.sort((a, b) => (a.name < b.name ? -1 : 1));

      setContacts(contacts);
    }

    fetchContacts();
  }, []);

  return (
    <main className="contacts">
      <h1>Contacts</h1>
      <ul className="contacts--list">
        {contacts.map((contact) => (
          <li
            key={contact.id}
            className="contacts--contact"
            onClick={() => call(contact)}
          >
            <div className="contacts--contact--info">
              <img
                alt={contact.name}
                src={contact.avatar}
                className="contacts--contact--avatar"
              />
              <span className="contacts--contact--name">{contact.name}</span>
            </div>
            <FaVideo className="contacts--contact--icon" />
          </li>
        ))}
      </ul>
    </main>
  );
}

export default Contacts;
