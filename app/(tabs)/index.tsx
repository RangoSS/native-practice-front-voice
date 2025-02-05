import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, Alert } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

const VoiceRecorder = () => {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceNotes, setVoiceNotes] = useState([]);
  const [newName, setNewName] = useState('');

  const voicesFolder = `${FileSystem.documentDirectory}voices/`;

  useEffect(() => {
    requestPermissions();
    ensureVoicesFolder(); // Ensure the "voices" folder exists on app start
    loadVoiceNotes();
  }, []);

  // Request microphone permission
  const requestPermissions = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Please enable microphone access in settings.');
    }
  };

  // Ensure "voices" folder exists
  const ensureVoicesFolder = async () => {
    const folderExists = await FileSystem.getInfoAsync(voicesFolder);
    if (!folderExists.exists) {
      await FileSystem.makeDirectoryAsync(voicesFolder, { intermediates: true });
    }
  };

  // Load all saved voice notes
  const loadVoiceNotes = async () => {
    try {
      await ensureVoicesFolder(); // Ensure folder exists before reading files
      const files = await FileSystem.readDirectoryAsync(voicesFolder);
      setVoiceNotes(files);
    } catch (error) {
      console.error('Error loading voice notes:', error);
    }
  };

  // Start recording audio
  const startRecording = async () => {
    try {
      await ensureVoicesFolder(); // Ensure the folder exists before saving
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  // Stop recording and save the file
  const stopRecording = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        const fileName = `voice_note_${Date.now()}.m4a`;
        const filePath = voicesFolder + fileName;

        await FileSystem.moveAsync({ from: uri, to: filePath });
        setRecording(null);
        setIsRecording(false);

        loadVoiceNotes();
        Alert.alert('Recording Saved', `Saved at: ${filePath}`);
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  // Rename a voice note
  const renameVoiceNote = async (oldName) => {
    if (!newName.trim()) {
      Alert.alert('Invalid Name', 'Please enter a valid name.');
      return;
    }

    const oldPath = voicesFolder + oldName;
    const newPath = voicesFolder + newName.trim() + '.m4a';

    try {
      await FileSystem.moveAsync({ from: oldPath, to: newPath });
      setNewName('');
      loadVoiceNotes();
      Alert.alert('Success', 'Voice note renamed successfully.');
    } catch (error) {
      console.error('Error renaming file:', error);
    }
  };

  // Delete a voice note
  const deleteVoiceNote = async (fileName) => {
    Alert.alert('Delete Confirmation', 'Are you sure you want to delete this voice note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            await FileSystem.deleteAsync(voicesFolder + fileName);
            loadVoiceNotes();
            Alert.alert('Deleted', 'Voice note deleted successfully.');
          } catch (error) {
            console.error('Error deleting file:', error);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isRecording ? styles.buttonRecording : styles.buttonStart]}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <Text style={styles.buttonText}>{isRecording ? 'Stop Recording' : 'Start Recording'}</Text>
      </TouchableOpacity>

      <FlatList
        data={voiceNotes}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.voiceItem}>
            <Text style={styles.voiceText}>{item}</Text>
            <TextInput
              style={styles.input}
              placeholder="Rename file..."
              onChangeText={(text) => setNewName(text)}
            />
            <TouchableOpacity style={styles.renameButton} onPress={() => renameVoiceNote(item)}>
              <Text style={styles.renameText}>Rename</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteVoiceNote(item)}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    width: 200,
    alignItems: 'center',
    marginBottom: 20,
    marginTop:10,
  },
  buttonStart: {
    backgroundColor: '#4CAF50',
  },
  buttonRecording: {
    backgroundColor: '#E53935',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  voiceItem: {
    flexDirection: 'column',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  voiceText: {
    fontSize: 14,
    color: '#333',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '80%',
    padding: 5,
    marginVertical: 5,
  },
  renameButton: {
    backgroundColor: '#007BFF',
    padding: 5,
    marginTop: 5,
    borderRadius: 5,
  },
  renameText: {
    color: 'white',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#E53935',
    padding: 5,
    marginTop: 5,
    borderRadius: 5,
  },
  deleteText: {
    color: 'white',
    fontSize: 14,
  },
});

export default VoiceRecorder;
