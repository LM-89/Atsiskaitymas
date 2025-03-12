import { Link } from "react-router-dom";
import { User } from "../types";

interface UserListProps {
  users: User[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
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
