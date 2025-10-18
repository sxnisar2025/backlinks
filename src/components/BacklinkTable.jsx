import React from 'react';

function BacklinkTable({ backlinks, onDelete, onEdit }) {
  return (
    <table className="table table-striped table-hover">
      <thead className="table-dark">
        <tr>
          <th>#</th>
          <th>Project</th>
          <th>Website</th>
          <th>URL</th>
          <th>DA</th>
          <th>Spam Score</th>
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
              <td>
                <div className="btn-group">
                  <button className="btn btn-sm btn-warning" onClick={() => onEdit(i)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => onDelete(i)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7" className="text-center">
              No backlinks added yet.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default BacklinkTable;
