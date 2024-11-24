import React, {useContext } from 'react';
import { CameraView} from 'expo-camera';
import { View, StyleSheet } from 'react-native';
import { isError } from '@/constants/Utils';
import { SetQrData } from './ContextQr';


export default function CameraElement(){

    const {setQrDataDesignation, setQrDataLot} = useContext(SetQrData);

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

        <View style={styles.camera}>
            <CameraView style={styles.apicamera} 
            facing={"back"}  
            barcodeScannerSettings={{
                                    barcodeTypes: ["qr"],
                                    }}
            onBarcodeScanned={handleBarCodeScanned}>
            </CameraView>
        </View>

    )
}



const styles = StyleSheet.create({

    camera: {
        backgroundColor: 'blue',
        height: 300, // Remplace les pourcentages par des pixels ou une valeur adaptative
        width: '80%',
      },

    apicamera:{
        flex:1
      },


})