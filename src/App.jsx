import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Navbar from "./components/Navbar";
import BacklinkForm from "./components/BacklinkForm";
import BacklinkTable from "./components/BacklinkTable";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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

  // 📊 Dashboard Data
  const total = backlinks.length;
  const live = backlinks.filter((b) => b.status?.toLowerCase() === "live").length;
  const waiting = backlinks.filter((b) => b.status?.toLowerCase() === "waiting").length;
  const rejected = backlinks.filter((b) => b.status?.toLowerCase() === "rejected").length;

  const chartData = [
    { name: "Live", value: live },
    { name: "Waiting", value: waiting },
    { name: "Rejected", value: rejected },
  ];

  const COLORS = ["#28a745", "#ffc107", "#dc3545"];

  return (
    <div>
      <Navbar />
      <div className="container-fluid my-4 px-5">
        {/* Header Row */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Backlinks Records</h4>

          {/* 📥 Download & 📤 Upload Buttons */}
          <div>
            <button className="btn btn-success me-2" onClick={downloadExcel}>
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

        {/* 🧱 Dashboard Section */}
        <div className="row mb-4">
          {/* Left Column (col-8) */}
          <div className="col-md-8">
            <div className="row g-6">
              <div className="col-md-6">
                <div className="card text-center shadow-sm mb-4">
                  <div className="card-body">
                    <h6>Total Backlinks</h6>
                    <h4 className="text-primary">{total}</h4>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card text-center shadow-sm mb-4">
                  <div className="card-body">
                    <h6>Live Backlinks</h6>
                    <h4 className="text-success">{live}</h4>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card text-center shadow-sm">
                  <div className="card-body">
                    <h6>Waiting Backlinks</h6>
                    <h4 className="text-warning">{waiting}</h4>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card text-center shadow-sm">
                  <div className="card-body">
                    <h6>Rejected Backlinks</h6>
                    <h4 className="text-danger">{rejected}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (col-4) */}
          <div className="col-md-4">
            <div className="card shadow-sm p-3" style={{ height: "100%" }}>
              <h6 className="text-center">Backlink Status Chart</h6>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    label
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
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
