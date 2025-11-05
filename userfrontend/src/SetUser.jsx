import axios from "axios";
import React from "react";
import { useState } from "react";

export default function SetUser() {
  const [user, setuser] = useState({
    name: "",
    email: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setuser({
      ...user,
      [name]: value,
    });
  }

  const handleSave = () => {
    try {
      axios.post("http://localhost:8084/user/set", user);
      console.log("User saved successfully", response.data);
    } catch (error) {
      console.error("Error saving user", error);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "20px auto" }}>
      <h2>Save User Users</h2>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={user.name}
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={user.email}
        onChange={handleChange}
      />
      <button onClick={handleSave}>Save User</button>
    </div>
  );
}
