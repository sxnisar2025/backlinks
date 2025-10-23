import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Navbar from "./components/Navbar";
import BacklinkForm from "./components/BacklinkForm";
import BacklinkTable from "./components/BacklinkTable";

function App() {
  const [backlinks, setBacklinks] = useState([]);
  const [editing, setEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const backlinksPerPage = 5;

  // ➕ Add backlink
  const addBacklink = (newBacklink) => {
    setBacklinks([...backlinks, newBacklink]);
  };

  // 🗑️ Delete backlink
  const deleteBacklink = (index) => {
    setBacklinks(backlinks.filter((_, i) => i !== index));
    setEditing(false);
  };

  // ✏️ Start editing
  const startEdit = (index) => {
    setEditing(true);
    setCurrentIndex(index);
  };

  // 💾 Update backlink
  const updateBacklink = (updatedBacklink) => {
    const updated = backlinks.map((b, i) =>
      i === currentIndex ? updatedBacklink : b
    );
    setBacklinks(updated);
    setEditing(false);
    setCurrentIndex(null);
  };

  // 🔍 Search logic
  const filteredBacklinks = backlinks.filter((b) =>
    Object.values(b)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // 📄 Pagination
  const indexOfLast = currentPage * backlinksPerPage;
  const indexOfFirst = indexOfLast - backlinksPerPage;
  const currentBacklinks = filteredBacklinks.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredBacklinks.length / backlinksPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // 📥 Download Excel
  const downloadExcel = () => {
    if (backlinks.length === 0) {
      alert("No data to export!");
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(backlinks);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Backlinks");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "backlinks_record.xlsx");
  };

  // 📤 Bulk Upload Excel
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);
      setBacklinks([...backlinks, ...jsonData]);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <Navbar />
      <div className="container my-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Backlinks Record</h4>

          {/* 📥 Download & 📤 Upload Buttons */}
          <div>
            <button
              className="btn btn-success me-2"
              onClick={downloadExcel}
            >
              Download Excel
            </button>
            <label className="btn btn-primary mb-0">
              Upload Excel
              <input
                type="file"
                accept=".xlsx, .xls"
                hidden
                onChange={handleFileUpload}
              />
            </label>
          </div>
        </div>

        {/* Form */}
        <BacklinkForm
          onAdd={addBacklink}
          onUpdate={updateBacklink}
          editing={editing}
          currentBacklink={editing ? backlinks[currentIndex] : null}
        />

        {/* Search */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Project, Website, or URL..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Table */}
        <BacklinkTable
          backlinks={currentBacklinks}
          onDelete={deleteBacklink}
          onEdit={startEdit}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <nav>
            <ul className="pagination justify-content-center">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => paginate(currentPage - 1)}
                >
                  Previous
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i}
                  className={`page-item ${
                    currentPage === i + 1 ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => paginate(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}

              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => paginate(currentPage + 1)}
                >
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
