import { View, Text, Image, StyleSheet } from 'react-native';
import SendEmail from '@/components/index/SendEmail';
import LinearGradient from 'react-native-linear-gradient';



export default function HomeScreen() {



  return (
   
    <View style = {styles.wrappers}>
      <View style={styles.container}>
        <Text style = {styles.titles}>Inventaire</Text>
      </View>
      <Image source={require('@/assets/images/E-Stock.png')} style={{ position: "absolute", flex: 1, marginTop:"50%"}}/>
      <SendEmail/>
    </View>

  );
}

const styles = StyleSheet.create({

  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    fontSize: 16,
    marginBottom: 20
  },
  wrappers:{
    backgroundColor:"rgb(38, 38, 38)",
    flex: 1, 
    alignItems: 'center',
  },


  container: {
    marginTop: 50,
    display: 'flex',
    justifyContent:'center',
    alignItems:'center',
    width:'60%',
    height: '6%',
    borderRadius: '10%',
  },

  titles: {
    fontWeight:'bold',
    fontSize: 20,
    color:"rgb(245,245,245)",
    fontFamily: "Roboto"
  }
});