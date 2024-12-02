import { View, Text,FlatList, StyleSheet, TextInput, TouchableHighlight  } from 'react-native';
import React, {  useContext, useState, useEffect } from 'react';
import { Stock } from '@/constants/Interface';
import { ModifierDataDisplay } from './ContextStock';
import * as SQLite from 'expo-sqlite';



const ModifierStockData = () => {

    const {listSelectedItem, totalSum, setTotalSum, setListItemDelete} = useContext(ModifierDataDisplay)
    const [handleState, setHandleState] = useState<number|null>(0)

  

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
        const sumQuantite: Array<{ quantite: number | null }> = await db.getAllAsync(`SELECT quantite FROM history WHERE lot = ? AND designation = ?`,[lot, designation]);
        const totalQuantite: number = sumQuantite.reduce((sum, row) => sum + (row.quantite ?? 0),0);
        await db.getFirstAsync(`UPDATE stock SET quantite = ? WHERE lot = ? AND designation = ?`,[totalQuantite, lot, designation]);
        setTotalSum(totalQuantite);
        }  
        catch (error) {
          if (error instanceof Error) {
            console.error("Error message:", error.message);
            alert(`Error: ${error.message}`);
          } 
          else {
            console.error("Unknown error:", error);
            alert("An unknown error occurred while saving data.");
          }
        }
      }


    const updateQuantite = (value:string, id:number) =>{
      const valueNumber = Number(value);
      if (valueNumber > 0){
        updateDataInDatabase(valueNumber, id)
      }
    }


    const updateElement = (id: number) => {
      setHandleState((prevId) => (prevId === id ? null : id));
      setListItemDelete(([prevId]) => (prevId === id ? [] : [id]))
    };
   



    return (
        <View>
          <FlatList<Stock>
            data={Array.isArray(listSelectedItem) ? listSelectedItem : null}
            keyExtractor={(item) => item.id?.toString() ?? 'defaultKey'} 
            renderItem={({ item }) => (
              <View style={{display: 'flex',justifyContent: 'space-evenly',}}>
                <TouchableHighlight style={[styles.elements, item.id === handleState ? styles.selected : null]} 
                  onPress={() => updateElement(item.id ?? 0)}>
                  {item.id === handleState ? (
                  <>
                    <Text style={{ color: "white" }}>{`Designation: ${item.designation} `}</Text>
                    <Text style={{ color: "white" }}>{`Lot: ${item.lot} `}</Text>
                    <Text style={{ color: "white" }}>{`Quantité(s): `}</Text>
                    <TextInput
                      style={styles.input}
                      placeholder={`${item.quantite}`}
                      keyboardType="numeric"
                      onChangeText={(text) => updateQuantite(text, item.id ?? 0)}
                    />
                  </>
                ) : (
                  <>
                    <Text style={{ color: "white" }}>{`Designation: ${item.designation} `}</Text>
                    <Text style={{ color: "white" }}>{`Lot: ${item.lot} `}</Text>
                    <Text style={{ color: "white" }}>{`Quantité(s): ${item.quantite} `}</Text>
                  </>)}
                </TouchableHighlight>
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
        backgroundColor:"rgb(49 46 129)",
        color: 'white',
        height: 70,
        padding: 5,
        margin: 2,
        marginTop: 10,
        marginBottom: 10,
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
        backgroundColor: "rgb(99 102 241)",
      },
    
 
      
      input: {
        borderColor:"transparent",
        color: "black",
        height: 40,
        borderWidth: 1,
        marginTop: 8,
        paddingHorizontal: 8,
      }

})