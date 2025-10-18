import React, { useState } from 'react';
import Navbar from './components/Navbar';
import BacklinkForm from './components/BacklinkForm';
import BacklinkTable from './components/BacklinkTable';

function App() {
  const [backlinks, setBacklinks] = useState([]);
  const [editing, setEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const backlinksPerPage = 5; // 👈 Change this number to adjust rows per page

  // Add backlink
  const addBacklink = (newBacklink) => {
    setBacklinks([...backlinks, newBacklink]);
    setCurrentPage(1); // reset to first page
  };

  // Delete backlink
  const deleteBacklink = (index) => {
    setBacklinks(backlinks.filter((_, i) => i !== index));
    setEditing(false);
  };

  // Start editing backlink
  const startEdit = (index) => {
    setEditing(true);
    setCurrentIndex(index);
  };

  // Update backlink
  const updateBacklink = (updatedBacklink) => {
    const updated = backlinks.map((b, i) =>
      i === currentIndex ? updatedBacklink : b
    );
    setBacklinks(updated);
    setEditing(false);
    setCurrentIndex(null);
  };

  // 🔍 Search filter
  const filteredBacklinks = backlinks.filter((b) =>
    Object.values(b)
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // 📄 Pagination logic
  const indexOfLast = currentPage * backlinksPerPage;
  const indexOfFirst = indexOfLast - backlinksPerPage;
  const currentBacklinks = filteredBacklinks.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredBacklinks.length / backlinksPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

        {/* 🔍 Search bar */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Project, Website, URL..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* 📋 Table */}
        <BacklinkTable
          backlinks={currentBacklinks}
          onDelete={deleteBacklink}
          onEdit={startEdit}
        />

        {/* 📄 Pagination controls */}
        {totalPages > 1 && (
          <nav>
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                  Previous
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i}
                  className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                >
                  <button className="page-link" onClick={() => paginate(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}

              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}

export default App;
