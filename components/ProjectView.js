
import { Image, StyleSheet, Touchable, TouchableOpacity, View, Text} from "react-native"

export default function Project(props) {
    return(
    
    <View style={styles.container}>
        <TouchableOpacity style={styles.titleWrapper} onPress={props.handleProjectPress}>
            <Text style={styles.title} index={props.index}>{props.title}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn } onPress={props.handleDelete}><Image style={styles.deleteImg}source={require("../assets/delete.png")}/></TouchableOpacity>
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
       flexDirection: "row",
       justifyContent: "space-between",
       alignItems: "center",
       marginBottom: 15
    },
    titleWrapper: {
        backgroundColor: "#0af",
        height: 45,
        width: "85%",
        justifyContent: "center",
        alignItems: "left",
        borderRadius: 10,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        borderRightColor: "#fff",
        borderRightWidth: 2,
        padding: 5,
        
    },
    title: {
      color: "#fff",
      fontSize: 20,
      fontWeight: "bold",  
      marginLeft: 10,
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
        backgroundColor: "#a5f",
        padding: 10,
        marginRight: 5,
        borderRadius: 5,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
    }
})