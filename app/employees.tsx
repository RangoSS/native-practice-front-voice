import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';

export default function UserManagement() {
  const [users, setUsers] = useState([]); // State to store the users
  const [error, setError] = useState(null); // State for errors
  const [newUser, setNewUser] = useState({
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
  }); // State to store new user input
  const [formVisible, setFormVisible] = useState(false); // State to toggle form visibility
  const [filters, setFilters] = useState({
    idNumber: '',
    role: '',
    name: '',
  }); // State to store filters for ID, role, and name

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/user'); // API endpoint
        const data = await response.json();

        // Extract users array from the response object
        if (data && data.users && Array.isArray(data.users)) {
          setUsers(data.users); // Set the users array
        } else {
          throw new Error('Invalid API response format.');
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users. Please check the API or try again later.');
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on the filters state (name, role, idNumber)
  const filteredUsers = users.filter((user) => {
    return (
      (user.idNumber && user.idNumber.includes(filters.idNumber)) &&
      (user.role && user.role.includes(filters.role)) &&
      (
        (user.name && user.name.toLowerCase().includes(filters.name.toLowerCase())) ||
        (user.surname && user.surname.toLowerCase().includes(filters.name.toLowerCase()))
      )
    );
  });

  // Handle the submission of a new user
  const handleAddUser = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        const addedUser = await response.json();
        setUsers([...users, addedUser]); // Update users list with the newly added user
        setNewUser({ // Reset form fields after successful submission
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
      } else {
        throw new Error('Failed to add user');
      }
    } catch (err) {
      console.error('Error adding user:', err);
      setError('Failed to add user. Please try again later.');
    }
  };

  // Handle the filter change
  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>User Management</Text>

      {/* Display error if any */}
      {error && <Text style={styles.error}>{error}</Text>}

      {/* Filter Section */}
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.input}
          placeholder="Filter by ID Number"
          value={filters.idNumber}
          onChangeText={(text) => handleFilterChange('idNumber', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Filter by Role"
          value={filters.role}
          onChangeText={(text) => handleFilterChange('role', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Filter by Name"
          value={filters.name}
          onChangeText={(text) => handleFilterChange('name', text)}
        />
      </View>

      {/* Display user cards in a row, wrapping when necessary */}
      <View style={styles.cardContainer}>
        {filteredUsers.map((user) => (
          <View key={user.id} style={styles.card}>
            <Text style={styles.cardTitle}>
              {user.name} {user.surname}
            </Text>
            <Text>ID: {user.idNumber}</Text>
            <Text>Email: {user.email}</Text>
            <Text>Role: {user.role}</Text>
            <Text>Designation: {user.designation}</Text>
            <Text>Joining Date: {user.joining_date}</Text>
            <Text>Salary: {user.salary}</Text>
            <Text>Phone: {user.phone}</Text>
            <Text>Address: {user.address}</Text>
          </View>
        ))}
      </View>

      {/* Button to toggle visibility of the form */}
      <Button title={formVisible ? "Hide Add User Form" : "Add New User"} onPress={() => setFormVisible(!formVisible)} />

      {/* Add User Form (visible when formVisible is true) */}
      {formVisible && (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Add New User</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={newUser.name}
            onChangeText={(text) => setNewUser({ ...newUser, name: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Surname"
            value={newUser.surname}
            onChangeText={(text) => setNewUser({ ...newUser, surname: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="ID Number"
            value={newUser.idNumber}
            onChangeText={(text) => setNewUser({ ...newUser, idNumber: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={newUser.email}
            onChangeText={(text) => setNewUser({ ...newUser, email: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={newUser.password}
            onChangeText={(text) => setNewUser({ ...newUser, password: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Role"
            value={newUser.role}
            onChangeText={(text) => setNewUser({ ...newUser, role: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Designation"
            value={newUser.designation}
            onChangeText={(text) => setNewUser({ ...newUser, designation: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Joining Date"
            value={newUser.joining_date}
            onChangeText={(text) => setNewUser({ ...newUser, joining_date: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Salary"
            value={newUser.salary}
            onChangeText={(text) => setNewUser({ ...newUser, salary: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone"
            value={newUser.phone}
            onChangeText={(text) => setNewUser({ ...newUser, phone: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={newUser.address}
            onChangeText={(text) => setNewUser({ ...newUser, address: text })}
          />

          {/* Button to add the new user */}
          <Button title="Add User" onPress={handleAddUser} />
        </View>
      )}
    </ScrollView>
  );
}

// Styles for the component
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  error: {
    color: 'red',
    marginBottom: 20,
    fontSize: 16,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    marginRight: 10,
    width: '18rem', // Set card width to 18rem as per your requirement
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  filterContainer: {
    marginBottom: 20,
  },
});

