import React, { useEffect, useState } from 'react';
import './AdminUsers.css';
import api from '../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await api.get('/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('token');
        await api.delete(`/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(users.filter(u => u._id !== userId));
      } catch (err) {
        alert('Failed to delete user');
      }
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.put(
        `/admin/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.map(u => u._id === userId ? response.data.user : u));
    } catch (err) {
      alert('Failed to update user role');
    }
  };

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="users-loading">Loading users...</div>;
  if (error) return <div className="users-error">{error}</div>;

  return (
    <div className="admin-users">
      <div className="users-header">
        <h1>User Management</h1>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Username</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user._id}>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>{user.phone || '-'}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className={`role-select ${user.role}`}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="no-data">No users found</div>
      )}
    </div>
  );
};

export default AdminUsers;
