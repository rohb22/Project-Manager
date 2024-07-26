import React from 'react';
import { View, Text, StyleSheet, ScrollView, Button, TouchableOpacity, TextInput, ActivityIndicator, Keyboard, Image, KeyboardAvoidingView } from 'react-native';
import  AsyncStorage  from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react';


export default function ProjectDetails({route}) {
    let projectIndex = route.params

    const [projects, setProjects] = useState([])
    const [project, setProject] = useState(null)
    const [showAddFeature, setShowAddFeature] = useState(false)
    const [feature, setFeature] = useState('')
    const [showEditNotes, setShowEditNotes] = useState(false)
    const [notes, setNotes] = useState("")
    const [showEditProject, setShowEditProject] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')


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
            const projectList = JSON.parse(savedProjects);
            let selectedProject = projectList[projectIndex]
            setProjects(projectList)
            setProject(selectedProject)
            if(selectedProject) {
              setTitle(selectedProject.title)
              setDescription(selectedProject.description || '')
            }
          }
          } catch (error) {
          console.error('Error loading tasks:', error);
        }
      };
    
      loadProjects();
    }, []);


  const handleShowAddFeature = () => {
      setShowAddFeature(!showAddFeature)
      if(setShowAddFeature) setFeature('')
      Keyboard.dismiss()
  }

  const handleFeatureChange = (text) => {
      setFeature(text)
  }

  const handleCancelFeature = () =>{
      setShowAddFeature(false)
      setFeature('')
      Keyboard.dismiss()
  }

  const handleSaveFeature = () => {
      Keyboard.dismiss()
      if (feature == '') return
      const updatedProject = {
          ...project,
          features: [...(project.features), feature]
        };
        const updatedProjects = [...projects];
        updatedProjects[projectIndex] = updatedProject;
  
        setProjects(updatedProjects);
        setProject(updatedProject);
        saveProjects(updatedProjects);
        handleCancelFeature();
    };

  const handleDeleteFeature = (featureToDelete) => {
      const newFeatureList = project.features.filter(f => f != featureToDelete)
      const updatedProject = {...project, features: newFeatureList}
      const updatedProjects = [...projects]
      updatedProjects[projectIndex] = updatedProject

      setProject(updatedProject)
      setProjects(updatedProjects)
      saveProjects(updatedProjects)
  }

  const handleEditNotes = () => {
      Keyboard.dismiss()
      if(showEditNotes){
          const newNotes = notes
          const updatedProject = {...project, notes: newNotes}
          const updatedProjects = [...projects]
          updatedProjects[projectIndex] = updatedProject

          setProject(updatedProject)
          setProjects(updatedProjects)
          saveProjects(updatedProjects)
      }
      setShowEditNotes(!showEditNotes)
  }

  const handleNotesChange = (text) => {
      setNotes(text)
  }

  const handleShowEditProject = () => {
      setShowEditProject(true)
  }

  const handleEditTitleChange = (text) => {
      setTitle(text)
  }
  
  const handleEditDescriptionChange = (text) => {
      setDescription(text)
  }
  const handleSave = () => {
      setShowEditProject(false)
      Keyboard.dismiss()
      if (title == "") {
          setTitle(project.title)
          return
      }
      const updatedProject = {...project, description: description, title: title}
      const updatedProjects = [...projects]
      updatedProjects[projectIndex] = updatedProject
      setProject(updatedProject)
      setProjects(updatedProjects)
      saveProjects(updatedProjects)
      
  }

  const handleCancel = () => {
      setShowEditProject(false)
      Keyboard.dismiss()
      setTitle(project.title)
      setDescription(project.description)
  }

  if (project == null) {
      return(
          <View style={styles.container}>
              <ActivityIndicator style={styles.loading} size="large"/>
          </View>
      )
    }

  return (
    <View style={styles.container}>
        {showEditProject && (
        <KeyboardAvoidingView style={styles.formOverlay}>
        <View style={styles.formContainer}>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>Project Name: </Text>
            <TextInput style={styles.titleInput} value={title} onChangeText={handleEditTitleChange}></TextInput>
          </View>
          <View style={styles.formField}>
            <Text style={styles.formLabel}>Project Description: </Text>
            <TextInput style={styles.descriptionInput} multiline={true} placeholder='Description' value={description} onChangeText={handleEditDescriptionChange}></TextInput>
          </View>
          <View style={styles.formOptions}>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}><Text style={styles.saveTxt}>Save</Text></TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}><Text style={styles.cancelTxt}>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    )}
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
        <View style={styles.header}>
            <View style={styles.headerTitle}>
                <TouchableOpacity style={styles.editNotesBtn} onPress={handleShowEditProject}><Image style={styles.deleteImg}source={require("../assets/edit.png")}/></TouchableOpacity>
                <Text style={styles.title}>{project.title}</Text>
            </View>
            <Text style={styles.description}>{project.description}</Text>
        </View>
        <View style={styles.label}>
            <TouchableOpacity style={styles.addFeatureBtn} onPress={handleShowAddFeature}><Text style={styles.addFeatureTxt}>+</Text></TouchableOpacity>
            <Text style={styles.title}>Features</Text>
        </View>
        <View style={styles.featureContainer}>
            {project.features.map((feature, index) => {
                return(
                    <View style={styles.featureWrapper}>
                        <TouchableOpacity style={styles.deleteBtn } onPress={() => handleDeleteFeature(feature)}><Image style={styles.deleteImg}source={require("../assets/delete-black.png")}/></TouchableOpacity>
                        <Text key={index} style={styles.featureTxt}>{feature}</Text>
                    </View>
                )
            })}
        </View>
            {showAddFeature && (
                <View>
                    <TextInput multiline={true} style={styles.addFeatureInput} placeholder='New Feature' value={feature} onChangeText={handleFeatureChange}></TextInput>
                    <View style={styles.formOptions}>
                        <TouchableOpacity style={styles.saveBtn} onPress={handleSaveFeature}><Text style={styles.saveTxt}>Save</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelFeature}><Text style={styles.saveTxt}>Cancel</Text></TouchableOpacity>
                    </View>
                </View>
            )}
        <View style={styles.label}>
            <TouchableOpacity style={styles.editNotesBtn} onPress={handleEditNotes}><Image style={styles.deleteImg}source={require("../assets/edit.png")}/></TouchableOpacity>
            <Text style={styles.title}>Notes</Text>
        </View>
        {showEditNotes ? (<TextInput style={styles.notesInput} multiline={true} value={notes} onChangeText={handleNotesChange} placeholder='Make sure to click the edit icon again to save'></TextInput>) : (<Text style={styles.notesTxt}>{project.notes}</Text>)}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  headerTitle: {
    flexDirection: "row",

  },
  description: {
    marginLeft: 20,
    fontSize: 18,
    marginBottom: 20,
  },
  label: {
    flexDirection: "row",
    alignItems: "center",
  },
  addFeatureTxt: {
    fontSize: 30,
  },
  addFeatureBtn: {
    marginRight: 20,
    marginBottom: 10,
  },
  loading: {
    justifyContent: "center",
    alignItems: "center",
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
  },
  addFeatureInput: {
    borderColor: "#000",
    borderWidth: 1,
    marginBottom: 10,
    fontSize: 20,
    padding: 5, 
    borderRadius: 5
  },
  featureContainer: {
    marginBottom: 10
  },
  featureTxt: {
    fontSize: 20
  },
  featureWrapper: {
    flexDirection: "row",
    justifyContent: "left",
    alignItems: "center"
  },
  deleteImg: {
    width: 20,
    height: 20,
},
deleteBtn: {
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    width: "15%",
    padding: 10,
    borderRadius: 5,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
},
    editNotesBtn : {
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
        marginBottom: 10,
    },
    notesInput: {
        backgroundColor: "#eee",
        borderRadius: 5,
        borderWidth: 1,
        fontSize: 15,
        padding: 10
},
notesTxt: {
    backgroundColor: "#eee",
    borderRadius: 5,
    fontSize: 15,
    padding: 10
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
  
});
