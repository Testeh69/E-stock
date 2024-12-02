import React, { useState } from 'react';
import { View,Button, Text, StyleSheet } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { Stock} from '@/constants/Interface';
import { isError } from '@/constants/Utils';
import CameraElement from '@/components/qr/Camera';
import FormDataQr from '@/components/qr/FormData';
import { FillFormDataQrCode,SetQrData } from '@/components/qr/ContextQr';




export default function QrScreen() {
  

  const [qrDataDesignation, setQrDataDesignation] = useState<string|null>(null)
  const [qrDataLot, setQrDataLot] = useState<string | null>(null);
  const [quantite, setQuantite] = useState<string|null>('');
  


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
  
     const searchResultQuantite : Stock|null = await db.getFirstAsync(
        `SELECT quantite FROM stock WHERE lot = ? AND designation = ?`, 
        qrDataLot, qrDataDesignation
      );
      if (searchResultQuantite && searchResultQuantite.quantite !== undefined && searchResultQuantite.quantite !== null) {
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
        await db.runAsync(
          "INSERT INTO stock (designation, lot, quantite) VALUES (?, ?, ?)", 
          qrDataDesignation, qrDataLot, quantite
        );
        console.log('New stock item added');
      }
      console.log("Data saved successfully");
      setQrDataDesignation(null);
      setQrDataLot(null);
      setQuantite("");
      alert("Data saved successfully!");
    } catch (error) {
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
  }}

  
  return (
    <View style={styles.wrappers}>
      <View style={styles.container}>
        <Text style={styles.titles}>QR CODE</Text>
      </View>
      <View style={styles.body}>
        <SetQrData.Provider value = {{setQrDataDesignation, setQrDataLot}}>
          <CameraElement />
        </SetQrData.Provider>
        <FillFormDataQrCode.Provider value = {{qrDataDesignation, qrDataLot, quantite, setQuantite}}>
          <FormDataQr />
        </FillFormDataQrCode.Provider>
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
    backgroundColor: 'rgb(30, 30, 30',
  },
  container: {
    marginTop: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '40%',
    height: 50, // Remplace les pourcentages
    borderRadius: 10, // Fixe les valeurs numériques
  },
  
  titles: {
    fontWeight: 'bold',
    fontSize: 20,
    color:"white"

  },

  body: {
    flex: 1,
    marginTop: '10%',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: "rgb(38, 38, 38)",
    width: '100%',
  },

});
