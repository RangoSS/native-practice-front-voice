import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Button,
  TextInput,
} from 'react-native';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

const HomeScreen = () => {
  const [recording, setRecording] = useState(null);
  const [voiceNotes, setVoiceNotes] = useState([]);
  const [playing, setPlaying] = useState(null);
  const [editNameId, setEditNameId] = useState(null);
  const [newName, setNewName] = useState('');
  const [recordingTime, setRecordingTime] = useState(0); // Track recording time

  // Load voice notes from AsyncStorage on component mount
  useEffect(() => {
    const loadVoiceNotes = async () => {
      const storedNotes = await AsyncStorage.getItem('voiceNotes');
      if (storedNotes) setVoiceNotes(JSON.parse(storedNotes));
    };
    loadVoiceNotes();
  }, []);

  // Save voice notes to AsyncStorage
  const saveVoiceNotes = async (notes) => {
    await AsyncStorage.setItem('voiceNotes', JSON.stringify(notes));
  };

  // Start recording audio
  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Microphone access is required.');
        return;
      }
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      setRecordingTime(0); // Reset recording time

      // Start updating recording time every second
      const intervalId = setInterval(() => {
        if (recording) {
          setRecordingTime((prevTime) => prevTime + 1);
        }
      }, 1000);

      // Stop updating time when recording is done
      recording.setOnRecordingStatusUpdate((status) => {
        if (status.isDoneRecording) {
          clearInterval(intervalId);
        }
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to start recording.');
    }
  };

  // Stop recording and save the audio file
  const stopRecording = async () => {
    try {
      if (!recording) {
        Alert.alert('Error', 'Recording instance is not available.');
        return;
      }
      await recording.stopAndUnloadAsync(); // Stop recording
      const uri = recording.getURI();
      if (!uri) {
        Alert.alert('Error', 'Recording URI is not available.');
        return;
      }

      const newVoiceNote = {
        id: uuidv4(),
        name: `Audio_${Math.floor(Math.random() * 1000)}`, // Random name
        uri,
        date: new Date().toLocaleString(),
      };
      const updatedNotes = [...voiceNotes, newVoiceNote];
      setVoiceNotes(updatedNotes);
      saveVoiceNotes(updatedNotes);
      setRecording(null); // Reset the recording state
      setRecordingTime(0); // Reset recording time
    } catch (error) {
      Alert.alert('Error', 'Unable to save recording.');
    }
  };

  // Play a voice note
  const playVoiceNote = async (uri) => {
    const sound = new Audio.Sound();
    try {
      if (playing) {
        await playing.stopAsync();
        setPlaying(null);
      } else {
        await sound.loadAsync({ uri });
        setPlaying(sound);
        await sound.playAsync();
        sound.setOnPlaybackStatusUpdate((status) => {
          if (!status.isPlaying) {
            setPlaying(null);
          }
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to play this voice note.');
    }
  };

  // Delete a voice note
  const deleteVoiceNote = (id) => {
    const updatedNotes = voiceNotes.filter((note) => note.id !== id);
    setVoiceNotes(updatedNotes);
    saveVoiceNotes(updatedNotes);
  };

  // Update the name of a voice note
  const updateVoiceNoteName = (id) => {
    if (newName.trim() === '') {
      Alert.alert('Error', 'Name cannot be empty.');
      return;
    }
    const updatedNotes = voiceNotes.map((note) =>
      note.id === id ? { ...note, name: newName } : note
    );
    setVoiceNotes(updatedNotes);
    saveVoiceNotes(updatedNotes);
    setEditNameId(null);
    setNewName('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Voice Notes</Text>
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
        color={recording ? 'red' : 'green'}
      />
      {recording && (
        <Text style={styles.recordingTime}>Recording Time: {recordingTime}s</Text>
      )}
      <FlatList
        data={voiceNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.voiceNote}>
            <TouchableOpacity onPress={() => playVoiceNote(item.uri)}>
              <Text style={styles.voiceNoteName}>{item.name}</Text>
              <Text>{item.date}</Text>
            </TouchableOpacity>
            {editNameId === item.id ? (
              <View style={styles.renameSection}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter new name"
                  value={newName}
                  onChangeText={setNewName}
                />
                <Button title="Save" onPress={() => updateVoiceNoteName(item.id)} />
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => setEditNameId(item.id)}
                style={styles.renameButton}
              >
                <Text style={styles.renameText}>Rename</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => deleteVoiceNote(item.id)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  voiceNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  voiceNoteName: { fontSize: 18, flex: 2 },
  renameSection: { flexDirection: 'row', alignItems: 'center', flex: 3 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  renameButton: { padding: 5, backgroundColor: '#007BFF', borderRadius: 5 },
  renameText: { color: '#fff' },
  deleteButton: { padding: 5, backgroundColor: 'red', borderRadius: 5 },
  deleteText: { color: '#fff' },
  recordingTime: { fontSize: 16, color: '#333', marginTop: 10 },
});

export default HomeScreen;
