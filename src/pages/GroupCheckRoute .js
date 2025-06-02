import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthProvider';
import Header from '../components/Header';

const GroupCheckRoute = () => {
  const { keycloak } = useContext(AuthContext);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (keycloak && keycloak.authenticated) {
      const tokenGroups = keycloak.tokenParsed?.groups || [];
      setGroups(tokenGroups);
    }
  }, [keycloak]);

  const handleContinue = () => {
    if (selectedGroup) {
      localStorage.setItem('selectedGroup', selectedGroup);
      navigate('/tasklist');
    } else {
      alert('Please select a group first.');
    }
  };

  return (
    <div className="container mt-4">
      <Header username="Manjula" onLogout={() => alert('Logout clicked')} />

      <h3>Select a Group</h3>

      {groups.length > 0 ? (
        <>
          <div className="mb-3">
            <select
              className="form-select"
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
            >
              <option value="">-- Choose Group --</option>
              {groups.map((group) => (
                <option key={group} value={group}>
                  {group.replace('/', '')}
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary" onClick={handleContinue}>
            Continue
          </button>
        </>
      ) : (
        <p className="text-muted">No groups found.</p>
      )}
    </div>
  );
};

export default GroupCheckRoute;
