import { View,Alert, Text,Button, StyleSheet } from 'react-native';
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import XLSX from "xlsx";
import * as SQLite from 'expo-sqlite';
import { Stock } from '@/constants/Interface';
import { getCurrentDate, arrayBufferToBase64 } from '@/constants/Utils';




export default function SendEmail (){

    const sendData = async () => {
        try {
          const currentDate: string = getCurrentDate()
          const db = await SQLite.openDatabaseAsync('databaseName');
          const getDataSql: Stock[] = await db.getAllAsync('SELECT designation, lot, quantite FROM stock');
          
          const enhancedData = getDataSql.map((row) => ({
            Référence: '',  
            Designation : row.designation, 
            Etablissement: 'AXYLLUS TECHNOLOGIES SARL',  
            Zone_de_stock: '',
            Emplacement:'',
            Lot: row.lot,
            Série: "",
            Tiers:"",
            Affaire:"",
            Statut_Qualité:"",
            Unité:"",
            Qté: "",
            Coefficient:"",
            Qté_comptée: row.quantite,
            Validité:"",
            Ecart:"",
            Unité_référence:"",
            Qté_référence:"",
            Qté_réservée:"",
            Unité_stock:"",
            Qté_stock:"",
            Coefficient_stock:"",
            Cout_unitaire:"",
            COut_total:"",
            Cout_compté:"",
            Ecart_montant:"",
            Devise_cout:"EUR",
            Barre_Longueur:""
          }));
    
          // Créer la feuille Excel à partir des données
          const worksheet = XLSX.utils.json_to_sheet(enhancedData);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
          // Convertir le workbook en chaîne binaire
          const binaryExcel = XLSX.write(workbook, { type: 'binary', bookType: 'xlsx' });
          // Convertir la chaîne binaire en tableau d'octets (Uint8Array)
          const buffer = new ArrayBuffer(binaryExcel.length);
          const view = new Uint8Array(buffer);
          for (let i = 0; i < binaryExcel.length; i++) {
            view[i] = binaryExcel.charCodeAt(i) & 0xff;
          }
          // Convertir le tableau d'octets en base64
          const base64Data = arrayBufferToBase64(buffer);
          const fileUri: string = FileSystem.documentDirectory + currentDate + `_stock.xlsx`;
          // Écrire les données en base64 dans un fichier
          await FileSystem.writeAsStringAsync(fileUri, base64Data, { encoding: FileSystem.EncodingType.Base64 });
          await Sharing.shareAsync(fileUri);
          Alert.alert('Succès', `Fichier créé et partagé avec succès : ${fileUri}`);
      
        } catch (error) {
          console.error('Erreur lors de la création ou du partage du fichier :', error);
          Alert.alert('Erreur', 'Impossible de créer ou partager le fichier.');
        }
      };
      
    
    
    const confirmSendData = () => {
      Alert.alert(
        `Confirmation d'envoie de données le: ${getCurrentDate()}`,
        `Vous voulez envoyez le fichier xslx ? `,
        [
          { text: "Annuler", style: "cancel" },
          { text: "Confirmer", onPress: sendData },
        ],
        { cancelable: false }
      );
    
    }
    
    return (
        <View style = { styles.wrapper__email}>
        <Button
        title = "send"
        onPress = {confirmSendData}
        />
      </View>

    )
}


const styles = StyleSheet.create({


    wrapper__email:{
      display:"flex",
      flexDirection:"column",
      justifyContent:"center",
      alignItems:"center",
      width:"100%",
      height:"80%",
      backgroundColor:"yellow",
    }})