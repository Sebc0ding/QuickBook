import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PROFESSIONAL_AVAILABILITY } from '../utils/queries';
import { ADD_AVAILABILITY } from '../utils/mutations';

const AvailabilityManager = () => {
  const [availabilityItems, setAvailabilityItems] = useState([]);
  const [newAvailability, setNewAvailability] = useState({
    day: 'Monday',
    startTime: '09:00',
    endTime: '17:00'
  });
  
  const { loading, data, refetch } = useQuery(GET_PROFESSIONAL_AVAILABILITY);
  const [addAvailability] = useMutation(ADD_AVAILABILITY);
  
  useEffect(() => {
    if (data?.getProfessionalAvailability) {
      setAvailabilityItems(data.getProfessionalAvailability);
    }
  }, [data]);
  
  const handleAddAvailability = async () => {
    try {
      await addAvailability({
        variables: newAvailability
      });
      
      // Reset form and refetch
      setNewAvailability({
        day: 'Monday',
        startTime: '09:00',
        endTime: '17:00'
      });
      refetch();
    } catch (error) {
      console.error('Error adding availability:', error);
    }
  };
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  return (
    <div className="availability-manager">
      <div className="availability-list">
        <h3>Your Availability</h3>
        {loading ? (
          <p>Loading availability...</p>
        ) : availabilityItems.length === 0 ? (
          <p>No availability set yet</p>
        ) : (
          <table className="availability-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Start Time</th>
                <th>End Time</th>
              </tr>
            </thead>
            <tbody>
              {availabilityItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.day}</td>
                  <td>{item.startTime}</td>
                  <td>{item.endTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      <div className="add-availability-form">
        <h3>Add Availability</h3>
        <div className="form-group">
          <label>Day:</label>
          <select 
            value={newAvailability.day}
            onChange={(e) => setNewAvailability({...newAvailability, day: e.target.value})}
          >
            {days.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Start Time:</label>
          <input 
            type="time" 
            value={newAvailability.startTime}
            onChange={(e) => setNewAvailability({...newAvailability, startTime: e.target.value})}
          />
        </div>
        
        <div className="form-group">
          <label>End Time:</label>
          <input 
            type="time" 
            value={newAvailability.endTime}
            onChange={(e) => setNewAvailability({...newAvailability, endTime: e.target.value})}
          />
        </div>
        
        <button onClick={handleAddAvailability}>Add Availability</button>
      </div>
    </div>
  );
};

export default AvailabilityManager;