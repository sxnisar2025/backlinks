import React from 'react';

function BacklinkTable({ backlinks, onDelete, onEdit }) {
  return (
    <div class="table-responsive">
    <table className="table table-striped table-hover align-middle">
      <thead className="table-dark">
        <tr>
          <th>#</th>
          <th>Project</th>
          <th>Website</th>
          <th>URL</th>
          <th>DA</th>
          <th>Spam Score</th>
          <th>Status</th> {/* ✅ New Column */}
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {backlinks.length > 0 ? (
          backlinks.map((b, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{b.projectName}</td>
              <td>{b.website}</td>
              <td>
                <a href={b.url} target="_blank" rel="noreferrer">
                  {b.url}
                </a>
              </td>
              <td>{b.domainAuthority}</td>
              <td>{b.spamScore}</td>

              {/* ✅ Show Status with color indicator */}
              <td>
                {b.status === 'Live' && (
                  <span className="badge bg-success">{b.status}</span>
                )}
                {b.status === 'Waiting' && (
                  <span className="badge bg-warning text-dark">{b.status}</span>
                )}
                {b.status === 'Rejected' && (
                  <span className="badge bg-danger">{b.status}</span>
                )}
                {!b.status && <span className="text-muted">N/A</span>}
              </td>

              <td>
                <div className="btn-group">
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => onEdit(i)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(i)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="8" className="text-center">
              No backlinks added yet.
            </td>
          </tr>
        )}
      </tbody>
    </table>
    </div>
  );
}

export default BacklinkTable;
