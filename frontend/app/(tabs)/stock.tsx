import { View,Alert,Button, Text, StyleSheet} from 'react-native';
import * as SQLite from 'expo-sqlite';
import React, { useState, useEffect} from 'react';
import { Stock , SearchResult } from '@/constants/Interface';
import StockData from '@/components/stock/StockData';
import ModifierStockData from '@/components/stock/ModifierStockData';
import { StockDataDisplay, ModifierDataDisplay } from '@/components/stock/ContextStock';








export default function StockScreen() {



  const [listItem, setListItem] = useState<Stock[]|null|string> ("")
  const [listItemDelete, setListItemDelete] = useState<number[]> ([])
  const [handleState, setHandleState] = useState<number>(0)
  const [listSelectedItem, setListSelectedItem] = useState<Stock[]|null|string>("")
  const [totalSum, setTotalSum] = useState<number|null>(null)




  const deleteData = async () => {
    try {
      const db = await SQLite.openDatabaseAsync('databaseName');
      const lengthListItemDelete : number = listItemDelete.length
      if (lengthListItemDelete > 0){
        for (const item of listItemDelete) {
          const SearchResult: SearchResult|null = await db.getFirstAsync(
            `SELECT designation, lot FROM stock WHERE id = ?`, 
            item 
          );
          if (SearchResult !== null){
          await db.runAsync(
            `DELETE FROM history WHERE designation = ? and lot = ?`,
            SearchResult.designation,
            SearchResult.lot
          );
        }
          await db.runAsync(
            'DELETE FROM stock Where ID = ?' , item
          );
        }
        alert(`${lengthListItemDelete} data(s) deleted succesfully`);
        setListItemDelete([])
      }

      else {
        await db.runAsync(
          'DELETE FROM stock'
        );
        await db.runAsync(
          'DELETE FROM history'
        );
        alert(`All Data Deleted succesfully`);
      }
  
    } catch (error) {
      console.error('Erreur lors de la suppression des données');
    }
  }


  const confirmDeletion = () => {
    Alert.alert(
      "Confirmation de suppression",
      "Êtes-vous sûr de vouloir supprimer les données ?",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Confirmer", onPress: deleteData },
      ],
      { cancelable: false }
    );
  };


  const getData = async () => {
    try {
      const db = await SQLite.openDatabaseAsync('databaseName');
      const allRows : Stock[]|null|undefined = await db.getAllAsync(
        'SELECT * FROM stock'
      );
      if (setListItem){
      setListItem(allRows)
      }
   else {
        console.warn('Aucun résultat trouvé dans la table stock.');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données SQLite :', error);
    }
  }

  const getDataResult = async () => {
    try {
      const db = await SQLite.openDatabaseAsync('databaseName');
      const getData: SearchResult | null | undefined = await db.getFirstAsync(
        'SELECT lot, designation FROM stock WHERE id = ?',
        listItemDelete[0]
      );
  
      if (getData?.designation && getData?.lot) {
        const getDataHistory: Stock[] | null | undefined = await db.getAllAsync(
          'SELECT * FROM history WHERE designation = ? AND lot = ?',
          getData.designation,
          getData.lot
        );
  
        // Check if history data exists and update state
        if (getDataHistory && getDataHistory.length > 0) {
          setTotalSum(getDataHistory.reduce(
            (hist, item) => item.quantite? hist + item.quantite :0,
            0
          ))
          setListSelectedItem(getDataHistory);  // Ensure setListSelectedItem updates correctly
        } else {
          console.log('No matching history records found');
        }
      } else {
        console.log('No matching stock data found');
      }
  
    } catch (error) {
      console.error('Erreur lors de la récupération des données SQLite :', error);
    }
  };

  const handleStateModifier = () => {
    if (handleState === 0) {
      setListItemDelete([])
      setHandleState(1);
      getDataResult();
    } else {
      setListItemDelete([])
      setHandleState(0);
      setListSelectedItem(null)
    }};

  useEffect(() => {
    getData();
  },[]);


  useEffect(() => {
    const interval = setInterval(() => {getData();}, 1000); 
    return () => clearInterval(interval);
    }, []);


  return (
    <View style={styles.wrapper}>
      <Text style={{ backgroundColor: 'green', marginTop: 40, marginBottom: 50 }}>
          Stock
      </Text>

      <View style = {styles.changeState}>
      {handleState === 0 ? 
        (listItem ? 
          (<StockDataDisplay.Provider value = {{listItem, listItemDelete, setListItemDelete}}>
             <StockData />
           </StockDataDisplay.Provider>)
           : 
          (<Text>Chargement des articles...</Text>))
          : 
            <ModifierDataDisplay.Provider value = {{listSelectedItem, totalSum, setTotalSum}}>
              <ModifierStockData />
            </ModifierDataDisplay.Provider>
        }
        <View style={styles.pannel__button}>{
          handleState === 0 ?          
          <Button
            title={listItemDelete.length > 0 ? `Delete ${listItemDelete.length}` : 'Delete All'}
            onPress={confirmDeletion}
            color="#841584"
            accessibilityLabel="Delete button"/>: 
            (listItemDelete.length === undefined ?  
            <Button
            title={listItemDelete.length > 0 ? `Delete ${listItemDelete.length}` : 'Delete All'}
            onPress={confirmDeletion}
            color="#841584"
            accessibilityLabel="Delete button"/>:
            null)}
          {(listItemDelete.length === 1 && handleState === 0) || handleState === 1 ? (
            <Button
              onPress={() => handleStateModifier()}
              title={handleState === 0 ? 'Modifier' : 'Back'}
            />): null}
        </View>
      </View>   
    </View>
    );}

const styles = StyleSheet.create({
  changeState: {
    backgroundColor: "green",
    height: "85%",
    width: "100%",
    padding: 10,
  },

  pannel__button: {
    backgroundColor: "yellow",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent:"space-evenly", 
    alignItems: "center",
    marginBottom: 20,
    padding: 10,
  },

  wrapper: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
  },

  selected: {
    backgroundColor: "red",
  },

  normal: {
    backgroundColor: "yellow",
  },

  listItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: 'blue',
    padding: 10,
  },

  elements: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
});
