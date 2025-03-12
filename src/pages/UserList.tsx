import React from "react";
import { Link } from "react-router-dom";
import { useData } from "../context/DataContext";

const UserList: React.FC = () => {
  const { state } = useData();
  const { users } = state;

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <Link to={`/user/${user.id}`}>{user.nickname}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
