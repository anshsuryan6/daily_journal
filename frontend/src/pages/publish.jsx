//pages/publish.jsx

import { AppBar } from "../components/Appbar"
import { Editortiny } from "../components/tinytext"


export const Publish = () => {
  return (
    <div>
      <AppBar />
      <div className="p-6 text-2xl font-bold text-gray-700">
        ✍️ Write a New Journal Entry
      </div>
      <Editortiny />
    </div>
  );
};
