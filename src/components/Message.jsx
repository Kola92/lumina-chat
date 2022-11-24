import { AuthContext } from "../context/AuthContext";
import { useContext, useEffect, useRef } from "react";
import { ChatContext } from "../context/ChatContext";
import ReactTimeAgo from "react-time-ago";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const ref = useRef();

  useEffect(() => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const time = new Date(message?.date?.seconds * 1000);

  return (
    <div ref={ref} className={`message ${message.sender === currentUser.uid && "owner"}`}>
      <div className='message__info'>
        <img
          src={
            message.sender === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=''
        />
        <span className='message__info-time'>
          <ReactTimeAgo date={time} />
        </span>
      </div>
      <div className='message__content'>
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt='' />}
      </div>
    </div>
  );
};

export default Message;
