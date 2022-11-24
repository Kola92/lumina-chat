import Search from "./Search";
import Chats from "./Chats";
import {BiEdit} from 'react-icons/bi';

const Sidebar = () => {
  return (
    <aside className='sidebar'>
      <header className='sidebar__header'>
        <h1>Messages</h1>
        <span className='sidebar__chatIcon'>
          <BiEdit />
        </span>
      </header>

      <div className='sidebar__search'>
        <Search />
      </div>

      <div className='sidebar__chats'>
        <Chats  />
      </div>
    </aside>
  );
};

export default Sidebar;
