import Sidebar from "../components/Sidebar";
import ChatBox from "../components/ChatBox";
import NavBar from "../components/NavBar";
import luminaChatLogo from "../assets/images/lumina-chat-logo.png";
import { signOut } from "firebase/auth";
import { auth } from "../components/firebase";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const Home = () => {
  const { currentUser } = useContext(AuthContext);
  const { photoURL, displayName } = currentUser;
  console.log(photoURL);
  return (
    <section className='home'>
      <div className='home__container'>
        <section className='home__sidebar'>
          <div className='home__sidebar-signout'>
            <div className='home__sidebar-logo'>
              <img src={luminaChatLogo} alt='Logo' aria-label='Website logo' />
            </div>
            <div className='home__sidebar-signoutBtn'>
              <section className='home__sidebar-userProfileInfo'>
                <img
                  src={photoURL}
                  alt='User profile'
                  aria-label="Account user's image"
                />
                <span>{displayName}</span>
              </section>

              <button onClick={() => signOut(auth)}>Sign Out</button>
            </div>
          </div>
          <Sidebar />
        </section>
        <section className='home__right'>
          <div className='home__navBar'>
            <NavBar />
          </div>
          <div className='home__chatbox'>
            <ChatBox />
          </div>
        </section>
      </div>
    </section>
  );
};

export default Home;
