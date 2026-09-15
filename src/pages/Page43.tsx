import React, { useState } from "react";

function Page43() {
  const [name, setName] = useState("John");

  const users = ["John", "Sarah", "Mike"];

  return (
    <div>
      <h1>Hello {name}</h1>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
      >

      <button onClick={setName("Mike")}>
        Change Name
      </button>

      <ul>
        {users.map((user) => {
          <li>{user}</li>
        })}
      </ul>

      <p>{user.email.toUpperCase()}</p>
    </div>
  );
}

export default Page43;
