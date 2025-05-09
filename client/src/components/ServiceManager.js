import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PROFESSIONAL_SERVICES } from '../utils/queries';
import { ADD_SERVICE, UPDATE_SERVICE, DELETE_SERVICE } from '../utils/mutations';

function ServiceManager() {
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [serviceFormData, setServiceFormData] = useState({
    name: '',
    duration: 60,
    price: 0,
    description: ''
  });

  const { loading, data, refetch } = useQuery(GET_PROFESSIONAL_SERVICES);
  const [addService, { error: addError }] = useMutation(ADD_SERVICE);

  useEffect(() => {
    // Any effects you want to run when component mounts
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setServiceFormData({
      ...serviceFormData,
      [name]: name === 'duration' || name === 'price' ? parseInt(value) : value
    });
  };

  const handleAddService = async (event) => {
    event.preventDefault();
    try {
      await addService({
        variables: { ...serviceFormData }
      });
      
      // Reset form data
      setServiceFormData({
        name: '',
        duration: 60,
        price: 0,
        description: ''
      });
      
      // Close form
      setShowServiceForm(false);
      
      // Refresh services list
      refetch();
    } catch (err) {
      console.error('Error adding service:', err);
    }
  };

  return (
    <div className="p-4 border rounded shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Services</h3>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowServiceForm(!showServiceForm)}
        >
          {showServiceForm ? 'Cancel' : '+ Add Service'}
        </button>
      </div>

      {showServiceForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h4 className="card-title mb-3">Add New Service</h4>
            <form onSubmit={handleAddService}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Service Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={serviceFormData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="duration" className="form-label">Duration (minutes)</label>
                <input
                  type="number"
                  className="form-control"
                  id="duration"
                  name="duration"
                  value={serviceFormData.duration}
                  onChange={handleInputChange}
                  min="15"
                  step="15"
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="price" className="form-label">Price ($)</label>
                <input
                  type="number"
                  className="form-control"
                  id="price"
                  name="price"
                  value={serviceFormData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  value={serviceFormData.description}
                  onChange={handleInputChange}
                  rows="3"
                ></textarea>
              </div>
              
              <button type="submit" className="btn btn-success">Add Service</button>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : data?.professionalServices && data.professionalServices.length > 0 ? (
        <div className="list-group">
          {data.professionalServices.map((service) => (
            <div key={service._id} className="list-group-item list-group-item-action">
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{service.name}</h5>
                <small>${service.price}</small>
              </div>
              <p className="mb-1">{service.description}</p>
              <small>{service.duration} minutes</small>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info">
          You haven't added any services yet. Click "Add Service" to get started.
        </div>
      )}
    </div>
  );
}

// Make sure to export the component as default
export default ServiceManager;