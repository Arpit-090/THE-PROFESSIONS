import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const SameInterestUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { accessToken } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("Access Token:", accessToken);

        const res = await fetch("http://localhost:3000/api/v1/users/same-interests", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization":accessToken // proper format
          },
          // credentials: "include", // only needed if using cookies
        });

        const data = await res.json();
        console.log("API response:", data);

        if (res.ok) {
          setUsers(data.data || []);
        } else {
          setError(data.message || "Something went wrong");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchUsers();
    } else {
      setLoading(false);
      setError("No access token found. Please login.");
    }
  }, [accessToken]);

  return (
    <div>
      <h2>Users with Same Interests</h2>

      {loading && <p>Loading users...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <ul>
          {users.length > 0 ? (
            users.map((user) => (
              <li key={user._id} style={{ marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
                <img
                  src={user.avatar}
                  alt={user.username}
                  style={{ width: "40px", height: "40px", borderRadius: "50%" }}
                />
                <div>
                  <strong>{user.fullname}</strong> ({user.username})
                  <br />
                  <span>{user.email}</span>
                  <br />
                  <span>
                    Common Interests:{" "}
                    {user.commonInterests?.flat().join(", ") || "None"}
                  </span>
                </div>
              </li>
            ))
          ) : (
            <p>No users found</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default SameInterestUsers;
