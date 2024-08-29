import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    camera: {
      flex: 1,
    },
    buttonContainer: {
      flex: 1,
      justifyContent: 'flex-end', 
      alignItems: 'center',
      marginBottom: 64, 
    },
    button: {
      alignSelf: 'center', 
      alignItems: 'center', 
      marginBottom: 16, 
    },
    text: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'white',
    },
  });