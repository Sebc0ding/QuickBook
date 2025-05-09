function ServiceManager() {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    name: '',
    duration: 60,
    price: 0,
    description: ''
  });
  
  const { loading, data, refetch } = useQuery(GET_PROFESSIONAL_SERVICES);
  const [addService] = useMutation(ADD_SERVICE);
  
  useEffect(() => {
    if (data && data.me && data.me.services) {
      setServices(data.me.services);
    }
  }, [data]);
  
  const handleAddService = async () => {
    try {
      await addService({
        variables: { ...newService }
      });
      
      // Reset form and refetch data
      setNewService({
        name: '',
        duration: 60,
        price: 0,
        description: ''
      });
      refetch();
    } catch (err) {
      console.error('Error adding service:', err);
    }
  };
  
  return (
    <div className="service-manager">
      <div className="service-list">
        <h3>Your Services</h3>
        {loading ? (
          <p>Loading services...</p>
        ) : services.length === 0 ? (
          <p>No services defined yet</p>
        ) : (
          services.map((service, index) => (
            <div key={index} className="service-item">
              <h4>{service.name}</h4>
              <p>{service.description}</p>
              <p>{service.duration} minutes - ${service.price}</p>
            </div>
          ))
        )}
      </div>
      
      <div className="add-service-form">
        <h3>Add New Service</h3>
        <input
          type="text"
          placeholder="Service Name"
          value={newService.name}
          onChange={(e) => setNewService({...newService, name: e.target.value})}
        />
        <input
          type="number"
          placeholder="Duration (minutes)"
          value={newService.duration}
          onChange={(e) => setNewService({...newService, duration: parseInt(e.target.value)})}
        />
        <input
          type="number"
          placeholder="Price ($)"
          value={newService.price}
          onChange={(e) => setNewService({...newService, price: parseFloat(e.target.value)})}
        />
        <textarea
          placeholder="Description"
          value={newService.description}
          onChange={(e) => setNewService({...newService, description: e.target.value})}
        ></textarea>
        <button onClick={handleAddService}>Add Service</button>
      </div>
    </div>
  );
}