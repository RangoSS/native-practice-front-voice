import { StyleSheet,Text,View } from 'react-native'
import React ,{useState} from 'react'

export default function UserForm() {
    
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    idNumber: '',
    email: '',
    password: '',
    role: '',
    designation: '',
    joining_date: '',
    salary: '',
    phone: '',
    address: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('User created:', result);
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Surname</label>
        <input
          type="text"
          name="surname"
          value={formData.surname}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>ID Number</label>
        <input
          type="text"
          name="idNumber"
          value={formData.idNumber}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Role</label>
        <input
          type="text"
          name="role"
          value={formData.role}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Designation</label>
        <input
          type="text"
          name="designation"
          value={formData.designation}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Joining Date</label>
        <input
          type="date"
          name="joining_date"
          value={formData.joining_date}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Salary</label>
        <input
          type="number"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Phone</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Address</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}


export default UserForm

const style=StyleSheet.create({})