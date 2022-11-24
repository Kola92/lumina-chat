import { useContext } from "react";
import Message from "./Message";
import { MessageContext } from "../context/MessageContext";

const Messages = () => {
  // Get messages from the messages context
  const { messages } = useContext(MessageContext);

  return (
    <div className='messages'>
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
};

export default Messages;
