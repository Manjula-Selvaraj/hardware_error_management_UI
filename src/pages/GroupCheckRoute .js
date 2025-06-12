import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthProvider';
import Header from '../components/Header';

const GroupCheckRoute = () => {
  const { keycloak } = useContext(AuthContext);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const navigate = useNavigate();
const URL=process.env.REACT_APP_URL;
  useEffect(() => {
    if (keycloak && keycloak.authenticated) {
      const tokenGroups = keycloak.tokenParsed?.groups || [];
      setGroups(tokenGroups);
    }
  }, [keycloak]);

 const handleContinue = async () => {
  if (selectedGroup) {
    try {
      await keycloak.updateToken(60);
      const token = keycloak.token;
            const assignee = keycloak?.tokenParsed?.preferred_username;

      localStorage.setItem('selectedGroup', selectedGroup);

      const payload = {
        candidateGroup: selectedGroup,
        state: 'CREATED',
        assignee: assignee,
        pageSize: 20,
      };

      const response = await fetch(
        `${URL}/tasks/search`,
        payload,
        {
           method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      const taskList = response.data;
      
      // Optional: store or pass the task list
      localStorage.setItem('taskList', JSON.stringify(taskList));
      console.log("123456789",response);
      
      navigate('/tasklist');
    } catch (error) {
      console.error('Task search failed:', error);
      alert('Failed to fetch task list.');
    }
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
