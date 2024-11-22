import { View,Alert,Button, Text,FlatList, StyleSheet, TouchableHighlight  } from 'react-native';
import * as SQLite from 'expo-sqlite';
import React, { useState, useEffect } from 'react';









export default function TabTwoScreen() {


  interface Stock {
    id: number; // Clé primaire
    designation: string; // Nom du produit ou article
    lot: number; // Numéro de lot
    quantite: number; // Quantité disponible
  }


  interface SearchResult{
    designation: string;
    lot: number;
  }
  const [listItem, setListItem] = useState<Stock[]|null|string> ("")
  const [listItemDelete, setListItemDelete] = useState<number[]> ([])
  const [handleState, setHandleState] = useState<number>(0)
  const [listSelectedItem, setListSelectedItem] = useState<Stock[]|null|string>("")
  const [totalSum, setTotalSum] = useState<number|null>(null)

  const pushInDelete = (element: number) => {
    if (listItem !== null && listItemDelete?.includes(element) ) {
      setListItemDelete((prev) => (prev ? prev.filter((item) => item !== element) : []));
      console.log(listItemDelete);
    }
    else{
      setListItemDelete((prev) => (prev ? [...prev, element] : [element]));

    }
  };


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
  
      // Fetch data from the 'stock' table
      const getData: SearchResult | null | undefined = await db.getFirstAsync(
        'SELECT lot, designation FROM stock WHERE id = ?',
        listItemDelete[0]
      );
  
      // If getData is valid and contains both 'designation' and 'lot'
      if (getData?.designation && getData?.lot) {
        const getDataHistory: Stock[] | null | undefined = await db.getAllAsync(
          'SELECT * FROM history WHERE designation = ? AND lot = ?',
          getData.designation,
          getData.lot
        );
  
        // Check if history data exists and update state
        if (getDataHistory && getDataHistory.length > 0) {
          setTotalSum(getDataHistory.reduce(
            (hist, item) => hist + item.quantite,
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
      setHandleState(1);
      getDataResult();
    } else {
      setHandleState(0);
      setListSelectedItem(null)
    }
    console.log(handleState)
    console.log(listSelectedItem)
  };

  useEffect(() => {
    getData();
  },[]);


  useEffect(() => {
    const interval = setInterval(() => {
      getData();
    }, 1000); 

    return () => clearInterval(interval);
  }, []);


  return (
    <View style={styles.wrapper}>
      <Text style={{ backgroundColor: 'green', marginTop: 40, marginBottom: 50 }}>
          Stock
      </Text>

      <View style = {styles.changeState}>
      {handleState === 0 ? (
  listItem ? (
    <FlatList<Stock>
      data={listItem}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View
          style={{
            backgroundColor: 'blue',
            display: 'flex',
            justifyContent: 'space-evenly',
          }}
        >
          <TouchableHighlight
            onPress={() => pushInDelete(item.id)}
            style={listItemDelete?.includes(item.id) ? styles.selected : styles.normal}
          >
            <Text style={styles.elements}>
              {`Designation: ${item.designation}, Lot: ${item.lot}, Quantité: ${item.quantite}`}
            </Text>
          </TouchableHighlight>
        </View>
      )}
    />
  ) : (
    <Text>Chargement des articles...</Text>
  )
) : 
  <View>
  <FlatList<Stock>
      data={listSelectedItem}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View
          style={{
            backgroundColor: 'blue',
            display: 'flex',
            justifyContent: 'space-evenly',
          }}
        >
        <Text style={styles.elements}>
              {`Designation: ${item.designation}, Lot: ${item.lot}, Quantité: ${item.quantite}`}
        </Text>
        </View>
      )}
    />
  <Text style = {styles.elements__modifier}>
    Quantités totales : {totalSum}
  </Text>
  </View>
  }


<View style={styles.pannel__button}>
  <Button
    title={listItemDelete.length > 0 ? `Delete ${listItemDelete.length}` : 'Delete All'}
    onPress={confirmDeletion}
    color="#841584"
    accessibilityLabel="Delete button"
  />

  {listItemDelete.length === 1 ? (
    <Button
      onPress={() => handleStateModifier()}
      title={handleState === 0 ? 'Modifier' : 'Back'}
    />
  ) : null}
</View>
      </View>   
    </View>
  );
}

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
