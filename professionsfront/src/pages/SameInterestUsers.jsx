import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const SameInterestUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const { accessToken } = useContext(AuthContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/v1/users/same-interests",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: accessToken,
            },
            credentials: "include",
          }
        );

        const data = await res.json();
        console.log("API Response:", data);

        if (res.ok) {
          setUsers(data.message || []); // ✅ users actually come from message
        } else {
          setError(data.data || "Something went wrong");
        }
      } catch (err) {
        setError(err.message || "Something went wrong");
      }
    };

    fetchUsers();
  }, [accessToken]);

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Users with Same Interests
      </h2>
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "15px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                backgroundColor: "#fff",
              }}
            >
              <img
                src={user.avatar}
                alt={user.username}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <h3 style={{ margin: "10px 0" }}>{user.fullname}</h3>
              <p style={{ margin: "5px 0", color: "gray" }}>{user.email}</p>
              <p style={{ fontSize: "14px", margin: "10px 0" }}>{user.bio}</p>
              <p style={{ fontSize: "13px", color: "green" }}>
                Interests: {user.interests.flat().join(", ")}
              </p>
              <p style={{ fontSize: "13px", color: "blue" }}>
                Common Interests: {user.commonInterests.flat().join(", ")}
              </p>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center", gridColumn: "1/-1" }}>
            No users found
          </p>
        )}
      </div>
    </div>
  );
};

export default SameInterestUsers;