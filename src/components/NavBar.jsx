import { FiVideo, FiPhone } from "react-icons/fi";

import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";

const NavBar = () => {
  const { data } = useContext(ChatContext);

  return (
    <nav className='navBar__container'>
      <div className='navBar__left'>
        <img src={data.user.photoURL} alt='' />
        <div className='navBar__info'>
          <h3>{data.user.displayName}</h3>
          {/* <p className='navBar__status'>Typing...</p> */}
        </div>
      </div>
      <div className='navBar__right'>
        <div className='navBar__videoIcon'>
          <FiVideo />
        </div>
        <div className='navBar__phoneIcon'>
          <FiPhone />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
