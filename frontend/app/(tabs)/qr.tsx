import React, { useState, useEffect } from 'react';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { View,Button, Text,TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import * as SQLite from 'expo-sqlite';






export default function HomeScreen() {
  
  interface SearchQuantite{
    quantite:number |null;
  }
  const [qrDataDesignation, setQrDataDesignation] = useState<string|null>(null)
  const [qrDataLot, setQrDataLot] = useState<string | null>(null);
  const [quantite, setQuantite] = useState<string>('');
  
  function isError(error: unknown): error is Error {
    return error instanceof Error;
}

  const openDatabase = async () => {
    try {
      const db = await SQLite.openDatabaseAsync('databaseName');
      
      
      try{
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          designation TEXT NOT NULL,
          lot INTEGER NOT NULL,
          quantite INTEGER NOT NULL
        );
      `);

    
      await db.runAsync(
        "INSERT INTO history (designation, lot, quantite) VALUES (?, ?, ?)", 
        qrDataDesignation, qrDataLot, quantite
      );
    }catch (error) {
      // Handle specific errors
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        alert(`Error: ${error.message}`);
      } else {
        console.error("Unknown error:", error);
        alert("An unknown error occurred while saving data.");
      }
    }

      if (!qrDataDesignation || !qrDataLot || !quantite) {
        throw new Error('Please make sure all fields are filled in');
      }
  
      const searchResultQuantite : SearchQuantite |null = await db.getFirstAsync(
        `SELECT quantite FROM stock WHERE lot = ? AND designation = ?`, 
        qrDataLot, qrDataDesignation
      );
  
      if (searchResultQuantite && searchResultQuantite.quantite !== undefined && searchResultQuantite.quantite !== null) {
        // If the item exists, update the quantity
        const updatedQuantite = searchResultQuantite.quantite + parseInt(quantite, 10);
        const updateQueryQuantite = await db.runAsync(
          "UPDATE stock SET quantite = ? WHERE lot = ? AND designation = ?", 
          updatedQuantite, qrDataLot, qrDataDesignation
        );
        console.log('Quantity updated:', updateQueryQuantite);
      } else {
        await db.execAsync(`
          PRAGMA journal_mode = WAL;
          CREATE TABLE IF NOT EXISTS stock (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            designation TEXT NOT NULL,
            lot INTEGER NOT NULL,
            quantite INTEGER NOT NULL
          );
        `);
  
        // Insert the new stock item
        await db.runAsync(
          "INSERT INTO stock (designation, lot, quantite) VALUES (?, ?, ?)", 
          qrDataDesignation, qrDataLot, quantite
        );
        console.log('New stock item added');
      }
  
      console.log("Data saved successfully");
  
      // Reset the form data after successful save
      setQrDataDesignation(null);
      setQrDataLot(null);
      setQuantite("");
  
      // Optionally: Show a success message to the user
      alert("Data saved successfully!");
  
    } catch (error) {
      // Handle specific errors
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        alert(`Error: ${error.message}`);
      } else {
        console.error("Unknown error:", error);
        alert("An unknown error occurred while saving data.");
      }
    }
   
  }

  
 

  const handleSave = ({}) =>{
    try {
    openDatabase()
    }
    catch (error) {
      if (isError(error)) {
          console.error("Error message:", error.message);
      } else {
          console.error("Unknown error:", error);
      }
  }
  
    }
    
    
  

  const handleBarCodeScanned = ({ type, data }: { type: string, data: string}) => {
    try{
    const datasplit = data.split(",")
    setQrDataDesignation(datasplit[0].slice(1,-1))
    setQrDataLot(datasplit[1].slice(0,-2));}
    
    catch (error) {
      if (isError(error)) {
          console.error("Error message:", error.message);
      } else {
          console.error("Unknown error:", error);
      }
  }};



  
  return (
    <View style={styles.wrappers}>
      <View style={styles.container}>
        <Text style={styles.titles}>Inventaire</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.camera}>
          <CameraView style={styles.apicamera} 
          facing={"back"}  
          barcodeScannerSettings={{
                                    barcodeTypes: ["qr"],
                                  }}
          onBarcodeScanned={handleBarCodeScanned}>
          </CameraView>
        </View>
        <View style = {styles.data}>
          <View style = {styles.information}>
                <Text>
                    En cours de Travaux Historiques
                </Text>
            </View>
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
                    value={quantite}
                    onChangeText={setQuantite}
                />
            </View>
        </View>
        <Button
            onPress={handleSave}
            title="Save"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
          />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrappers: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  body: {
    flex: 1,
    marginTop: '10%',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: 'red',
    width: '100%',
  },
  camera: {
    backgroundColor: 'blue',
    height: 300, // Remplace les pourcentages par des pixels ou une valeur adaptative
    width: '80%',
  },

  apicamera:{
    flex:1
  },

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

  cameraControls: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  flipButton: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  flipText: {
    fontSize: 18,
    marginBottom: 10,
    color: 'white',
  },
  container: {
    marginTop: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '40%',
    height: 50, // Remplace les pourcentages
    backgroundColor: '#F61515',
    borderRadius: 10, // Fixe les valeurs numériques
  },
  titles: {
    fontWeight: 'bold',
    fontSize: 20,
  },
});
