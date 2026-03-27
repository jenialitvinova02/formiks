// filepath: client/src/components/UserList/UserList.tsx
import React from 'react';
import { User } from '../../hooks/useUsers';
import './UserList.scss';

interface Props {
  items: User[];
  onRoleChange: (id:number, role:string)=>void;
}

const UserList: React.FC<Props> = ({ items, onRoleChange }) => (
  <ul>
    {items.map(u=>(
      <li key={u.id}>
        {u.username} ({u.email}) – {u.role}
        <button onClick={()=>onRoleChange(u.id, u.role==='user'?'admin':'user')}>
          {u.role==='user'? 'Make Admin':'Revoke Admin'}
        </button>
      </li>
    ))}
  </ul>
);

export default UserList;