import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

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

      {/* Button to toggle visibility of the form */}
      <Button
        title={formVisible ? "Hide Add User Form" : "Add New User"}
        onPress={() => setFormVisible(!formVisible)}
      />

      {/* Add User Form */}
      {formVisible && (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Add New User</Text>
          {Object.keys(newUser).map((key) => (
            <TextInput
              key={key}
              style={styles.input}
              placeholder={key.replace('_', ' ').toUpperCase()}
              value={newUser[key]}
              onChangeText={(text) => setNewUser({ ...newUser, [key]: text })}
              secureTextEntry={key === 'password'}
            />
          ))}
          <Button title="Add User" onPress={handleAddUser} />
        </View>
      )}

      {/* Filter Section */}
      <View style={styles.filterContainer}>
        {Object.keys(filters).map((key) => (
          <TextInput
            key={key}
            style={styles.input}
            placeholder={`Filter by ${key}`}
            value={filters[key]}
            onChangeText={(text) => handleFilterChange(key, text)}
          />
        ))}
      </View>

      {/* User Cards */}
      <View style={styles.cardContainer}>
        {filteredUsers.map((user) => (
          <View key={user.id} style={styles.card}>
            <Text style={styles.cardTitle}>{user.name} {user.surname}</Text>
            {Object.keys(user).map((field) => (
              field !== 'id' && (
                <Text key={field}>{`${field.replace('_', ' ')}: ${user[field]}`}</Text>
              )
            ))}
          </View>
        ))}
      </View>
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
    width: 150,
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
  formContainer: {
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
  filterContainer: {
    marginBottom: 20,
  },
});
