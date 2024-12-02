import { View,Text,FlatList, StyleSheet, TouchableHighlight  } from 'react-native';
import React, {useContext} from 'react';
import { Stock } from '@/constants/Interface';
import { StockDataDisplay } from './ContextStock';




const StockData = () => {


    const {listItem, listItemDelete, setListItemDelete} = useContext(StockDataDisplay);
    const pushInDelete = (element: number) => {
        if (listItem !== null && listItemDelete?.includes(element) ) {
          setListItemDelete((prev) => (prev ? prev.filter((item) => item !== element) : []));
        }
        else{
          setListItemDelete((prev) => (prev ? [...prev, element] : [element]));
        }
      };

    return (

        <View>
            <FlatList<Stock>
            data={ Array.isArray(listItem) ? listItem : []}
            keyExtractor={(item) => item.id?.toString() ?? 'defaultKey'}
            renderItem={({ item }) => (
                <View style={{
                    display: 'flex',
                    justifyContent: 'space-evenly',}}>
                <TouchableHighlight
                onPress={() => item.id ?pushInDelete(item.id): null}
                style={item.id ? (listItemDelete?.includes(item.id) ? styles.selected : styles.normal):null}
                >
                    <Text style={styles.elements}>
                        {`Designation: ${item.designation}, Lot: ${item.lot}, Quantité: ${item.quantite}`}
                    </Text>
                </TouchableHighlight>
            </View>
            )}/>
        </View>



    )
};
export default StockData;



const styles = StyleSheet.create({
    elements: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        borderRadius: 8,
        color: 'white',
        height: 20,
        marginTop: 30,
        marginBottom: 30,
      },


      selected: {
        backgroundColor: "rgb(99 102 241)", 
        borderRadius:10,
        marginTop:10,
        marginBottom:10,
      },
    
      normal: {
        backgroundColor:"rgb(49 46 129)",
        borderRadius:10,
        marginTop:10,
        marginBottom:10,
       
      }

})