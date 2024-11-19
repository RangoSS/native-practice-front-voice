import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Button,
} from 'react-native';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

const HomeScreen = () => {
  const [recording, setRecording] = useState(null);
  const [voiceNotes, setVoiceNotes] = useState([]);
  const [name, setName] = useState('');
  const [playing, setPlaying] = useState(null);

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
    } catch (error) {
      Alert.alert('Error', 'Unable to start recording.');
    }
  };

  // Stop recording and save the audio file
  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      const newVoiceNote = {
        id: uuidv4(),
        name: name || 'Unnamed Note',
        uri,
        date: new Date().toLocaleString(),
      };
      const updatedNotes = [...voiceNotes, newVoiceNote];
      setVoiceNotes(updatedNotes);
      saveVoiceNotes(updatedNotes);
      setName('');
      setRecording(null);
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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Voice Notes</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter note name..."
        value={name}
        onChangeText={setName}
      />
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
        color={recording ? 'red' : 'green'}
      />
      <FlatList
        data={voiceNotes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.voiceNote}>
            <TouchableOpacity onPress={() => playVoiceNote(item.uri)}>
              <Text style={styles.voiceNoteName}>{item.name}</Text>
              <Text>{item.date}</Text>
            </TouchableOpacity>
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  voiceNote: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  voiceNoteName: { fontSize: 18 },
  deleteButton: { backgroundColor: 'red', padding: 5, borderRadius: 5 },
  deleteText: { color: '#fff' },
});

export default HomeScreen;
