import { useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import ReactTimeAgo from "react-time-ago";
import { MessageContext } from "../context/MessageContext";

const Chats = () => {
  const [chats, setChats] = useState([]);
  const [allChats, setAllChats] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch, data } = useContext(ChatContext);

  // eslint-disable-next-line
  const { messages } = useContext(MessageContext);

  useEffect(() => {
    const getChats = () => {
      const unsubscribe = onSnapshot(
        doc(db, "userChats", currentUser.uid),
        (doc) => {
          setChats(doc.data());
        }
      );

      // clean up function
      return () => {
        unsubscribe();
      };
    };

    const getAllChats = () => {
      const unsubscribe = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
        setAllChats(doc.data());
      });

      // clean up function
      return () => {
        unsubscribe();
      };
    };

    // get chats if a user is available in the documents
    currentUser.uid && getChats();

    // get all chats if a chatId is available in the documents
    data.chatId && getAllChats();
  }, [currentUser.uid, data.chatId]);

  // handle user chat selection
  const handleChatSelection = (u) => {
    // dispatch the selected user to the chat context
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  const chatArr = Object.entries(chats);
  console.log(chatArr);
  console.log(allChats);

  // Convert chat object to an array and map through it
  const chatList = Object.entries(chats)
    ?.sort((a, b) => b[1].date - a[1].date)
    ?.map((chat) => {
      // Covert timestamp to date
      const chatTime = new Date(chat[1]?.date?.seconds * 1000);

      return (
        <div
          className='userChats'
          key={chat[0]}
          onClick={() => handleChatSelection(chat[1].userInfo)}
        >
          <img src={chat[1].userInfo.photoURL} alt='' />

          <div className='userChats__info'>
            <div className='userChats__message'>
              <span>{chat[1].userInfo.displayName}</span>
              <p>{chat[1].lastMessage}</p>
            </div>

            <div className='userChats__timeNot'>
              <p role='timer'>
                <ReactTimeAgo date={chatTime} />
              </p>
              {/* <span>{messages.length}</span> */}
            </div>
          </div>
        </div>
      );
    });

  return <div className='chats'>{chatList}</div>;
};

export default Chats;
