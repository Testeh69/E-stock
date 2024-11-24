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
                    Quantité :  
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
      backgroundColor: "green",
      justifyContent: "space-evenly",
      alignItems: "center",
      width: "80%"
    },
  
    data:{
      backgroundColor: "white",
      width: "80%",
      display: "flex",
      justifyContent: "space-evenly",
      alignItems: "center",
      height: "30%"
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginTop: 8,
      paddingHorizontal: 8,
    },

  });
  