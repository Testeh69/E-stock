import { View, Text,FlatList, StyleSheet, TextInput  } from 'react-native';
import React, {  useContext, useState, useEffect } from 'react';
import { Stock } from '@/constants/Interface';
import { ModifierDataDisplay } from './ContextStock';
import * as SQLite from 'expo-sqlite';



const ModifierStockData = () => {

    const {listSelectedItem, totalSum, setTotalSum} = useContext(ModifierDataDisplay)

    const deleteDataInDatabase = async(id:number) => {
      try {
        const db = await SQLite.openDatabaseAsync('databaseName');
        const result = await db.getFirstAsync(`SELECT lot, designation FROM history WHERE id = ?`,[id]);
        const { lot, designation } = result as { lot: string; designation: string };
        await db.getFirstAsync(`DELETE FROM history WHERE id = ?`, id)
        await db.getFirstAsync(`DELETE FROM stock WHERE lot = ? and designation = ?`, lot, designation)
      }
        catch (error) {
          if (error instanceof Error) {
            console.error("Error message:", error.message);
            alert(`Error: ${error.message}`);
          } else {
            console.error("Unknown error:", error);
            alert("An unknown error occurred while saving data.");
          }
        }
    }


    const updateDataInDatabase = async(quantite:number,id:number) => {
      try {
        const db = await SQLite.openDatabaseAsync("databaseName");

    await db.getFirstAsync(`UPDATE history SET quantite = ? WHERE id = ?`, [quantite, id]);

    const result = await db.getFirstAsync(`SELECT lot, designation FROM history WHERE id = ?`,[id]);

    if (!result) {
      console.error("No matching row found for the given ID.");
      return;
    }

    const { lot, designation } = result as { lot: string; designation: string };

    // Calculate totalQuantite
    const sumQuantite: Array<{ quantite: number | null }> = await db.getAllAsync(
      `SELECT quantite FROM history WHERE lot = ? AND designation = ?`,
      [lot, designation]
    );

    const totalQuantite: number = sumQuantite.reduce(
      (sum, row) => sum + (row.quantite ?? 0),
      0
    );

console.log(totalQuantite);

// Update quantite in stock
await db.getFirstAsync(
  `UPDATE stock SET quantite = ? WHERE lot = ? AND designation = ?`,
  [totalQuantite, lot, designation]
);

// Update state
setTotalSum(totalQuantite);
      }
        catch (error) {
          if (error instanceof Error) {
            console.error("Error message:", error.message);
            alert(`Error: ${error.message}`);
          } else {
            console.error("Unknown error:", error);
            alert("An unknown error occurred while saving data.");
          }
        }
    }


    const updateQuantite = (value:string, id:number) =>{
      const valueNumber = Number(value);
      if (valueNumber === 0){
        deleteDataInDatabase(id)
      }else{
        updateDataInDatabase(valueNumber, id)
      }
    }


    useEffect(()=>{
      const interval = setInterval(()=>{

      }, 1000);
      return () => clearInterval(interval)
    },[])



    return (
        <View>
          <FlatList<Stock>
            data={Array.isArray(listSelectedItem) ? listSelectedItem : null}
            keyExtractor={(item) => item.id?.toString() ?? 'defaultKey'} 
            renderItem={({ item }) => (
              <View
                style={{
                  backgroundColor: 'blue',
                  display: 'flex',
                  justifyContent: 'space-evenly',
                }}>
                <View style={styles.elements}>
                <Text style = {{color: "black"}}>
                      {`id: ${item.id} `}
                  </Text>
                  <Text style = {{color: "black"}}>
                      {`Designation: ${item.designation} `}
                  </Text>
                  <Text style = {{color:"black"}}>
                     {`Lot: ${item.lot} `}
                  </Text>
                  <Text style = {{color:"black"}}>
                      {`Quantité(s):`}
                  </Text>
                  <TextInput 
                    style={styles.input}
                    placeholder={`${item.quantite}`}
                    keyboardType="numeric"
                    onChangeText={(text) => updateQuantite(text, item.id ? item.id : 0)}
                  />
                </View>
              </View>
            )}
          />
        <Text style = {styles.elements__modifier}>
          Quantités totales : {totalSum}
        </Text>
        </View>
    )
};
export default ModifierStockData;


const styles = StyleSheet.create({

    elements: {
        display: "flex",
        flexDirection:"row",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        borderRadius: 8,
        backgroundColor: 'yellow',
        color: 'white',
        height: 40,
        padding: 5,
        margin: 2,
        marginTop: 20,
        marginBottom: 20,
      },

    elements__modifier: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-evenly",
        textAlign: "center",
        borderRadius: 8,
        backgroundColor: 'black',
        color: 'white',
        height: 40,
        padding: 5,
        margin: 2,
        marginTop: 20,
        marginBottom: 20,
      },
      selected: {
        backgroundColor: "red",
      },
    
      normal: {
        backgroundColor: "yellow",
      }, input: {
        color: "white",
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginTop: 8,
        paddingHorizontal: 8,
      }

})