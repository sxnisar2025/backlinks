import React, { useState, useEffect } from 'react';

function BacklinkForm({ onAdd, onUpdate, editing, currentBacklink }) {
  const [formData, setFormData] = useState({
    projectName: '',
    website: '',
    url: '',
    domainAuthority: '',
    spamScore: '',
  });

  useEffect(() => {
    if (editing && currentBacklink) {
      setFormData(currentBacklink);
    } else {
      setFormData({ projectName: '', website: '', url: '', domainAuthority: '', spamScore: '' });
    }
  }, [editing, currentBacklink]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.website || !formData.url) return;

    if (editing) {
      onUpdate(formData);
    } else {
      onAdd(formData);
    }

    setFormData({ projectName: '', website: '', url: '', domainAuthority: '', spamScore: '' });
  };

  return (
    <form className="mb-3" onSubmit={handleSubmit}>
      <div className="row g-2">
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
        <div className="col-md-2">
          <input
            type="number"
            name="domainAuthority"
            className="form-control"
            placeholder="DA"
            value={formData.domainAuthority}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            name="spamScore"
            className="form-control"
            placeholder="Spam Score"
            value={formData.spamScore}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-1 d-grid">
          <button className={`btn ${editing ? 'btn-success' : 'btn-primary'}`} type="submit">
            {editing ? 'Update' : 'Add'}
          </button>
        </div>
      </div>
    </form>
  );
}

export default BacklinkForm;
