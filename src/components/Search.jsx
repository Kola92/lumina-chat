import { BiSearchAlt2 } from "react-icons/bi";
import { useContext, useState } from "react";
import {
  collection,
  query,
  where,
  getDoc,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase.js";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  const handleSearch = async () => {
    // Create a reference to the users collection
    const usersRef = collection(db, "users");

    // Create a query against the collection.
    const q = query(usersRef, where("displayName", "==", username));

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (error) {
      setError(true);
    }
  };

  const handleKeyDown = async (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async (u) => {
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedId), {
          messages: [],
        });

        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [`${combinedId}.userInfo`]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [`${combinedId}.date`]: {
            time: serverTimestamp(),
          },
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [`${combinedId}.userInfo`]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [`${combinedId}.date`]: {
            time: serverTimestamp(),
          },
        });
      }
      dispatch({ type: "CHANGE_USER", payload: u})
    } catch (error) {
      console.log(error.message);
    }

    setUser(null);
    setUsername("");
  };

  return (
    <div className='search'>
      <div className='search__container'>
        <button type='submit' className='search__btn'>
          <BiSearchAlt2
            role='img'
            aria-label='Search Icon'
            style={{ width: "22px", height: "22px", fill: "#abacac" }}
          />
        </button>
        <input
          type='search'
          placeholder='Search people or message...'
          onKeyDown={handleKeyDown}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {error && <p className='search__error'>User not found!</p>}
      {user && (
        <div className='search__userResult' onClick={() => handleSelect(user)}>
          <img src={user.photoURL} alt='' />
          <div className='search__userResult-info'>
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
