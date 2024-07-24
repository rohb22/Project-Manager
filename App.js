import { StatusBar } from 'expo-status-bar';
import { Keyboard, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ProjectView from './components/ProjectView';
import { useState, useEffect } from 'react';
import  AsyncStorage  from '@react-native-async-storage/async-storage'


export default function App() {



  const createProject = (title, description,  features, notes) => {
    return({
        title: title,
        description: description,
        features: features,
        notes: notes,
    })
}

  const [showForm, setShowForm] = useState(false)
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState("")
  const [projects, setProjects] = useState([])

  const saveProjects = async (projects) => {
    try {
      await AsyncStorage.setItem('projects', JSON.stringify(projects))
    } catch(error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const savedProjects = await AsyncStorage.getItem('projects');
        if (savedProjects !== null) {
          setProjects(JSON.parse(savedProjects));
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    };
  
    loadProjects();
  }, []);

  const showProjectForm = () => {
    setShowForm(true)
  }

  const handleCancel = () => {
    Keyboard.dismiss()
    setShowForm(false)
    setTitle('')
    setDescription("")
  }

  const handleTitleChange = (text) => {
    setTitle(text)
  }

  const handleDescriptionChange = (text) => {
    setDescription(text)
  }

  const handleSave = () => {
    if (title == '') return
    let newProject = createProject(title, description)
    setShowForm(false)
    Keyboard.dismiss()
    setProjects([...projects, newProject])
    saveProjects([...projects, newProject])
    setTitle('')
    setDescription("")
  }

  const handleDelete = (index) => {
    let copyProject = [...projects]
    copyProject.splice(index, 1)
    setProjects(copyProject)
    saveProjects(copyProject)
  }

  

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {showForm && (        
        <KeyboardAvoidingView style={styles.formOverlay}>
          <View style={styles.formContainer}>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Project Name: </Text>
              <TextInput style={styles.titleInput} placeholder='Title' value={title} onChangeText={handleTitleChange}></TextInput>
            </View>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Project Description: </Text>
              <TextInput style={styles.descriptionInput} multiline={true} placeholder='Description' value={description} onChangeText={handleDescriptionChange}></TextInput>
            </View>
            <View style={styles.formOptions}>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}><Text style={styles.saveTxt}>Save</Text></TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}><Text style={styles.cancelTxt}>Cancel</Text></TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>)}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Projects</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={showProjectForm}><Text style={styles.headerAdd}>+</Text></TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {projects.map((project, index) => (
          <ProjectView title={project.title} key={index} index={index} handleDelete={() => handleDelete(index)}/>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 50,
    marginLeft: 25,
    marginRight: 25,
    borderBottomColor: "#000",
    borderBottomWidth: 2,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10
  },
  headerBtn: {
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  headerAdd: {
    fontSize: 40,
    fontWeight: "bold",
  },
  scrollView: {
    marginTop: 20,
    marginRight: 25,
    marginLeft: 25
},
formOverlay: {
  position: "absolute",
  backgroundColor: "rgba(0,0,0,0.6)",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1
},
  formContainer: {
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "left",
    justifyContent: "space-between",
    borderRadius: 20,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    maxWidth: "85%",
    width: "85%",
  },
  formField: {
    marginBottom: 30
  },
  formLabel: {
    fontSize: 20,
    fontWeight: "bold"
  },
  titleInput: {
    fontSize: 20,
    marginLeft: 5
  },
  descriptionInput: {
    padding: 5,
    fontSize: 15,
    marginLeft: 5,
  },
  formOptions: {
    flexDirection: "row",
    justifyContent: "space-around"
  },
  saveBtn: {
    backgroundColor: "#5fa",
    padding: 10,
    borderRadius: 5,
  },
  saveTxt: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold"
  },
  cancelBtn: {
    backgroundColor: "#f5a",
    padding: 10,
    borderRadius: 5,
  },
  cancelTxt: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold"
  }
});
