import { View, Text, StyleSheet } from 'react-native';
import SendEmail from '@/components/SendEmail';


export default function HomeScreen() {



  return (
    <View style = {styles.wrappers}>
      <View style={styles.container}>
        <Text style = {styles.titles}>Inventaire</Text>
        <SendEmail/>
      </View>
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
    flex: 1, 
    alignItems: 'center',
    backgroundColor: 'green',

  },


  container: {
    marginTop: 50,
    display: 'flex',
    justifyContent:'center',
    alignItems:'center',
    width:'60%',
    height: '6%',
    backgroundColor: '#F61515',
    borderRadius: '10%'
  },

  titles: {
    fontWeight:'bold',
    fontSize: 20,

  }
});