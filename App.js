import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView, Text, FlatList, View, Button, Linking } from 'react-native';
import * as Contacts from 'expo-contacts';
import * as Haptics from 'expo-haptics';
import * as Battery from 'expo-battery';


export default function App() {

  const [contacts, setContacts] = useState([]);
  const [batteryLevel, setLevelBattery] = useState({});
  const [batteryCharge, setBatteryCharge] = useState({});

  const getContacts = async () => {
    const access = await Contacts.requestPermissionsAsync();
    if (access.granted) {
      // we have permission grab contacts.
      const contactsData = await Contacts.getContactsAsync();
      setContacts(contactsData.data);
    }
  }

  const getBatteryLevel = async () => {
    const batteryLevelData = await Battery.getBatteryLevelAsync();
    setLevelBattery({ batteryLevelData });
    let _subscription = Battery.addBatteryLevelListener(({ batteryLevelData }) => {
      setLevelBattery({ batteryLevelData })
    });
  }
  
  const getChargingData = async () => {
    const batteryChargingData = await Battery.getBatteryStateAsync();
    setBatteryCharge({ batteryChargingData });
    let _subscription = Battery.addBatteryStateListener(({ batteryChargingData }) => {
      setBatteryCharge({ batteryChargingData })
    });

  }


  const call = (contact) => {
    let phoneNumber = contact.phoneNumbers[0].digits;
    console.log(phoneNumber);
    // make a phone call on "click"
    const link = `tel:${phoneNumber}`;
    Linking.canOpenURL(link)
      .then(supported => Linking.openURL(link))
      .catch(console.error);
  }

  useEffect(() => {
    getContacts();
    getBatteryLevel();
    getChargingData();
    
  }, [])
  console.log(batteryCharge);

  return (
    <View style={styles.container}>
      <SafeAreaView>
      <View style={styles.titleContainer}>
          <Text style={{ fontSize: 20 }}>Current Battery Level: {batteryLevel.batteryLevelData}%</Text>
          <Text style={{ fontSize: 20 }}>{batteryCharge.batteryChargingData === 2 ? <Text>Charging</Text> : <Text>Not Charging</Text>}</Text>
        </View>
        
        <View style={styles.titleContainer}>
          <Text style={{ fontSize: 20 }}>My Contacts</Text>
        </View>
        <View style={styles.content}>
          <FlatList
            data={contacts}
            keyExtractor={(contact) => contact.id}
            renderItem={({ item }) => <Button title={item.name} onPress={() => call(item)} />}
          />
        </View>
        <StatusBar style="auto" />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ggg',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 4,
    alignItems: 'center',
  }
});
