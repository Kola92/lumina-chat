import InputField from "./InputField";
import Messages from "./Messages";

const ChatBox = () => {
  return (
    <div className='chatBox'>
      <Messages />
      <InputField />
    </div>
  );
};

export default ChatBox;
