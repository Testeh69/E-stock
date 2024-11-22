import { Link } from 'expo-router';
import { View,Alert,TextInput, Text,Button, StyleSheet } from 'react-native';
import { useState } from 'react';
import emailjs from 'emailjs-com';  // Import EmailJS


export default function HomeScreen() {
  const [email, setEmail] = useState<string>("")



  const sendData = () => {
  
  };


const confirmSendData = () => {
  Alert.alert(
    "Confirmation d'envoie de données",
    `Êtes-vous sûr de vouloir envoyer les données à l'adresse suivante : ${email} ?`,
    [
      { text: "Annuler", style: "cancel" },
      { text: "Confirmer", onPress: sendData },
    ],
    { cancelable: false }
  );

}

  return (
    <View style = {styles.wrappers}>
    <View style={styles.container}>
      <Text style = {styles.titles}>Inventaire</Text>
    </View>
    <View style = { styles.wrapper__email}>
      <TextInput
        style={styles.input}
        onChangeText={(text)=>setEmail(text)}
        placeholder="Enter your email"
        keyboardType="email-address"  // Makes the keyboard more suited for email input
        autoCapitalize="none"         // Prevents capitalizing the first letter
        textContentType="emailAddress" // Ensures the text content type is email
      />
        <Button
        title = "send"
        onPress = {confirmSendData}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({


  wrapper__email:{
    display:"flex",
    flexDirection:"column",
    justifyContent:"center",
    alignItems:"center",
    width:"100%",
    height:"80%",
    backgroundColor:"yellow",
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    fontSize: 16,
    marginBottom: 20
  },
  wrappers:{
    flex: 1, 
    alignItems: 'center',
    backgroundColor: 'green',

  },


  container: {
    marginTop: 50,
    display: 'flex',
    justifyContent:'center',
    alignItems:'center',
    width:'60%',
    height: '6%',
    backgroundColor: '#F61515',
    borderRadius: '10%'
  },

  titles: {
    fontWeight:'bold',
    fontSize: 20,

  }
});