import React, { useState } from 'react';
import Navbar from './components/Navbar';
import BacklinkForm from './components/BacklinkForm';
import BacklinkTable from './components/BacklinkTable';

function App() {
  const [backlinks, setBacklinks] = useState([]);
  const [editing, setEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);

  const addBacklink = (newBacklink) => {
    setBacklinks([...backlinks, newBacklink]);
  };

  const deleteBacklink = (index) => {
    setBacklinks(backlinks.filter((_, i) => i !== index));
    setEditing(false);
  };

  const startEdit = (index) => {
    setEditing(true);
    setCurrentIndex(index);
  };

  const updateBacklink = (updatedBacklink) => {
    const updated = backlinks.map((b, i) =>
      i === currentIndex ? updatedBacklink : b
    );
    setBacklinks(updated);
    setEditing(false);
    setCurrentIndex(null);
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <BacklinkForm
          onAdd={addBacklink}
          onUpdate={updateBacklink}
          editing={editing}
          currentBacklink={editing ? backlinks[currentIndex] : null}
        />
        <BacklinkTable
          backlinks={backlinks}
          onDelete={deleteBacklink}
          onEdit={startEdit}
        />
      </div>
    </div>
  );
}

export default App;
