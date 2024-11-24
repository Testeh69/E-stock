import { View, Text,FlatList, StyleSheet  } from 'react-native';
import React, {  useContext } from 'react';
import { Stock } from '@/constants/Interface';
import { ModifierDataDisplay } from './ContextStock';



const ModifierStockData = () => {

    const {listSelectedItem, totalSum} = useContext(ModifierDataDisplay)

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
    )
};
export default ModifierStockData;


const styles = StyleSheet.create({

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
      }

})