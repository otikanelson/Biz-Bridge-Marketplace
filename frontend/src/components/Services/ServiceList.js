import { useEffect, useState } from "react";
import { getServices } from "../../api/services";

const ServiceList = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    getServices().then(data => setServices(data));
  }, []);

  return (
    <div>
      <h2>Available Services</h2>
      {services.map(service => (
        <div key={service._id}>
          <img src={`${API_BASE_URL}${service.artisan.profileImage}`} alt={service.name} />
          <h3>{service.name}</h3>
          <p>{service.description}</p>
          <p>Price: ${service.price}</p>
          <p>Category: {service.category}</p>
          <p>Provided by: {service.artisan.fullName} ({service.artisan.businessName})</p>
        </div>
      ))}
    </div>
  );
};

export default ServiceList;
