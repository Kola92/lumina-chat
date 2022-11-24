import { useId } from "react";
import { FaPaperPlane, FaPaperclip, FaRegImage } from "react-icons/fa";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
import { db, storage } from "./firebase";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const InputField = () => {
  const inputId = useId();

  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  // eslint-disable-next-line
  const [error, setError] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  // Handle sending chat
  const handleSend = async (e) => {
    // e.preventDefault();

    if(img) {
      // upload image file to firebase storage
      const storageRef = ref(storage, 'images');
      const uploadTask = uploadBytesResumable(storageRef, img);

      // Register three observers:
      // 1. 'state_changed' observer, called any time the state changes
      // 2. Error observer, called on failure
      // 3. Completion observer, called on successful completion
      uploadTask.on(
        () => {
          // Handle unsuccessful uploads
          setError(true);
        },
        () => {
          // Handle successful uploads on complete
          // get the download url from firebase storage
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            // add userChats to firestore
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuidv4(),
                text,
                img: downloadURL,
                sender: currentUser.uid,
                date: Timestamp.now(),
              }),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuidv4(),
          text,
          sender: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [`${data.chatId}.lastMessage`]: text,
      [`${data.chatId}.date`]: serverTimestamp()
    })

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [`${data.chatId}.lastMessage`]: text,
      [`${data.chatId}.date`]: serverTimestamp()
    })

    setText("");
    setImg(null);
  };

  return (
    <div className='inputField'>
      <div className='inputField__inputIcons'>
        <div className='inputField__uploadFile'>
          <FaPaperclip />
          <input
            type='file'
            style={{ display: "none" }}
            id={`file-${inputId}`}
            onChange={(e) => setImg(e.target.files[0])}
          />
          <label htmlFor={`file-${inputId}`}>
            <FaRegImage />
          </label>
        </div>
        <input
          type='text'
          placeholder='Write a message...'
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
      </div>

      <div role='button' className='submit' onClick={handleSend}>
        <FaPaperPlane aria-label='Send Message' />
      </div>
    </div>
  );
};

export default InputField;
