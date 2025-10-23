import React, { useState, useEffect } from 'react';

function BacklinkForm({ onAdd, onUpdate, editing, currentBacklink }) {
  const [formData, setFormData] = useState({
    projectName: '',
    website: '',
    url: '',
    domainAuthority: '',
    spamScore: '',
    status: '', // Initially empty for "Please Select"
  });

  useEffect(() => {
    if (editing && currentBacklink) {
      setFormData(currentBacklink);
    } else {
      setFormData({
        projectName: '',
        website: '',
        url: '',
        domainAuthority: '',
        spamScore: '',
        status: '',
      });
    }
  }, [editing, currentBacklink]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation: required fields
    if (!formData.website || !formData.url || !formData.status) {
      alert('Please fill all required fields, including Status.');
      return;
    }

    if (editing) {
      onUpdate(formData);
    } else {
      onAdd(formData);
    }

    setFormData({
      projectName: '',
      website: '',
      url: '',
      domainAuthority: '',
      spamScore: '',
      status: '',
    });
  };

  return (
    <form className="mb-3" onSubmit={handleSubmit}>
      <div className="row g-2 align-items-center">
        <div className="col-md-2">
          <input
            type="text"
            name="projectName"
            className="form-control"
            placeholder="Project Name"
            value={formData.projectName}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-2">
          <input
            type="text"
            name="website"
            className="form-control"
            placeholder="Website Name"
            value={formData.website}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-3">
          <input
            type="url"
            name="url"
            className="form-control"
            placeholder="URL"
            value={formData.url}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-1">
          <input
            type="number"
            name="domainAuthority"
            className="form-control"
            placeholder="DA"
            value={formData.domainAuthority}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-1">
          <input
            type="number"
            name="spamScore"
            className="form-control"
            placeholder="Spam"
            value={formData.spamScore}
            onChange={handleChange}
          />
        </div>

        {/* ✅ New Status Dropdown */}
        <div className="col-md-2">
          <select
            name="status"
            className="form-select"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="">Please Select</option>
            <option value="Live">Live</option>
            <option value="Waiting">Waiting</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="col-md-1 d-grid">
          <button
            className={`btn ${editing ? 'btn-success' : 'btn-primary'}`}
            type="submit"
          >
            {editing ? 'Update' : 'Add'}
          </button>
        </div>
      </div>
    </form>
  );
}

export default BacklinkForm;
