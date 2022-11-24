import { doc, onSnapshot } from "firebase/firestore";
import { createContext, useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import { db } from "../components/firebase";
import { ChatContext } from "./ChatContext";

export const MessageContext = createContext();

export const MessageContextProvider = ({children}) => {
 // Get data from the chat context
 const { data } = useContext(ChatContext);
 const [messages, setMessages] = useState([])

useEffect(() => {
  // Pull messages from firestore
  const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
    doc.exists() && setMessages(doc.data().messages);
  });

  // Clean up function
  return () => {
    unsub();
  };
}, [data.chatId]);

return (
  <MessageContext.Provider value={{messages}}>
    {children}
  </MessageContext.Provider>
)
}