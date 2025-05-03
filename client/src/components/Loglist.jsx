import { useEffect, useState } from 'react';
import api from '../api';
import './LogList.css';

const LogList = () => {
  const [logs, setLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await api.get('/');
      setLogs(res.data);
    };
    fetchLogs();
  }, []);

  return (
    <div className="log-container">
      <button className="log-toggle-btn" onClick={() => setShowLogs(!showLogs)}>
        {showLogs ? '🔒 Hide Logs' : '📜 Show Logs'}
      </button>

      {showLogs && (
        <div className="log-list">
          <h2>📦 Detection Logs</h2>
          <ul>
            {logs.map((log, index) => (
              <li key={index} className="log-item">
                <span className="log-object">🧩 {log.object}</span>
                <span className="log-status">Status: {log.status}</span>
                <span className="log-time">⏰ {new Date(log.time).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LogList;
