import React, { useState } from "react";

const ProfileForm = ({ onSubmit }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, email, avatar });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Nom</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 mt-1 border rounded-md outline-none dark:bg-gray-700 dark:text-white"
          placeholder="Nom"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 mt-1 border rounded-md outline-none dark:bg-gray-700 dark:text-white"
          placeholder="Email"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Avatar</label>
        <input
          type="file"
          onChange={(e) => setAvatar(e.target.files[0])}
          className="w-full mt-1"
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
      >
        Enregistrer
      </button>
    </form>
  );
};

export default ProfileForm;
