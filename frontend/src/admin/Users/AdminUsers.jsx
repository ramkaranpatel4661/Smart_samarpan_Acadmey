import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../main";
import Layout from "../Utils/Layout";
import toast from "react-hot-toast";
import Loading from "../../components/loading/Loading";
import { FaTrash, FaUserEdit } from "react-icons/fa";

const AdminUsers = ({ user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  if (user && user.role !== "admin") {
    return (
      <Layout>
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
          <h2 className="adm-page-title">Access Denied</h2>
          <p style={{ color: '#9b93b8' }}>You do not have admin privileges to manage users.</p>
        </div>
      </Layout>
    );
  }

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  async function fetchUsers() {
    try {
      const { data } = await axios.get(`${server}/api/users`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setUsers(data.users);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (id) => {
    if (confirm("Are you sure you want to update this user's role?")) {
      try {
        const { data } = await axios.put(
          `${server}/api/user/${id}`,
          {},
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        );

        toast.success(data.message);
        fetchUsers();
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  const deleteUser = (id) => {
    // Optional placeholder for future backend deletion logic
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      toast.error("User deletion API endpoint is not yet implemented.");
    }
  };

  if (loading) {
    return <Loading />;
  }

  // Filter users based on search query and role filter
  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });
  
  return (
    <Layout>
      <h2 className="adm-page-title">Manage Users</h2>
      
      <div className="adm-table-wrap">
        <div className="adm-table-top">
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="adm-table-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div style={{display: 'flex', gap: '10px'}}>
            <select 
              className="adm-table-search" 
              style={{width: 'auto'}}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="adm-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers && filteredUsers.length > 0 ? (
                filteredUsers.map((e, i) => (
                  <tr key={e._id}>
                    <td>{i + 1}</td>
                    <td>{e.name}</td>
                    <td>{e.email}</td>
                    <td>
                      <span className={`adm-role-badge ${e.role === 'admin' ? 'admin' : 'user'}`}>
                        {e.role}
                      </span>
                    </td>
                    <td>
                      <div className="adm-table-actions">
                        <button onClick={() => updateRole(e._id)} className="adm-btn-update" title="Toggle Role">
                          <FaUserEdit />
                        </button>
                        <button onClick={() => deleteUser(e._id)} className="adm-btn-delete" title="Delete User">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#9b93b8' }}>
                    No users found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default AdminUsers;