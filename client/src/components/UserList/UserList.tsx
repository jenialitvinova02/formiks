import React from 'react';
import { User } from '../../hooks/useUsers';
import './UserList.scss';

interface Props {
  items: User[];
  onRoleChange: (id:number, role:string)=>void;
}

const UserList: React.FC<Props> = ({ items, onRoleChange }) => (
  <ul className='userList'>
    {items.map(u=>(
      <li className='userList__title' key={u.id}>
        {u.username} ({u.email}) – {u.role}
        <button className='userList__title--button' onClick={()=>onRoleChange(u.id, u.role==='user'?'admin':'user')}>
          {u.role==='user'? 'Make Admin':'Revoke Admin'}
        </button>
      </li>
    ))}
  </ul>
);

export default UserList;