import React, { useContext } from 'react';
import { View, Text,TextInput, StyleSheet } from 'react-native';
import { FillFormDataQrCode } from './ContextQr';


export default function FormDataQr(){


    const {qrDataDesignation, qrDataLot, quantite, setQuantite} = useContext(FillFormDataQrCode);

    return (
        <View style = {styles.data}>
            <View style = {styles.information}>
                <Text>
                    Désignation : {qrDataDesignation}
                </Text>
            </View>
            <View style = {styles.information}>
                <Text>
                    Lot :   {qrDataLot}
                </Text>  
            </View>
            <View style = {styles.information}>
                <Text>
                    Quantité(s) :  
                </Text>
                <TextInput 
                    style={styles.input}
                    placeholder="Entrez une quantité"
                    keyboardType="numeric"
                    value={quantite || " "}
                    onChangeText={setQuantite}
                />
            </View>
        </View>
    )
} 




const styles = StyleSheet.create({

  
  
    information:{
      display: "flex",
      flexDirection: "row",
      backgroundColor: "rgb(99 102 241)",
      justifyContent: "space-evenly",
      alignItems: "center",
      width: "80%",
      height:"20%",
      borderRadius:5,
      shadowColor: "rgb(99 102 241)", // Couleur de l'ombre
      shadowOffset: { width: 0, height: 4 }, // Position de l'ombre
      shadowOpacity: 0.8, // Opacité de l'ombre
      shadowRadius: 10, // Rayon de l'ombre
      elevation: 10, // Util
   
    },
  
    data:{
      backgroundColor: "white",
      borderRadius:5,
      width: "80%",
      display: "flex",
      justifyContent: "space-evenly",
      alignItems: "center",
      height: "30%",
      shadowColor: 'white', // Couleur de l'ombre
      shadowOffset: { width: 0, height: 4 }, // Position de l'ombre
      shadowOpacity: 0.8, // Opacité de l'ombre
      shadowRadius: 10, // Rayon de l'ombre
      elevation: 10, // Util
    },
    input: {
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center",
        textAlign:"center",
        height: "100%",
        borderRadius:5,
        color:"white"
    },

  });
  