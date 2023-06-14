import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Image, ImageSourcePropType} from 'react-native';
import { useState } from 'react';

type Plant = {
    name: string;
    scientific_name: string;
    family: string;
    indoor: boolean;
    type: string;
    origin: string;
    description: string;
    watering: string;
    sunlight: string;
    maintenance: string;
    plant_image: string;     
  }

export default function PlantsPage () {

  const myPlant: Plant = {
    name: 'Peter the little pepper plant',
    scientific_name: 'peppes periapas',
    family: 'Dr Peppers',
    indoor: false,
    type: 'Mild',
    origin: 'UK',
    description: 'This is Peter he is here to help you design your app he is steppiing in as a placeholder if only you could get that config file working you loser',
    watering: 'Frequent',
    sunlight: 'little',
    maintenance:'Low',
    plant_image: 'https://images7.memedroid.com/images/UPLOADED644/57b9fb3f39d33.jpeg'
  };
  
  const myPlant2: Plant = {
    name: 'Onion the sad plant',
    scientific_name: 'Onionius',
    family: 'onyun',
    indoor: false,
    type: 'Mild',
    origin: 'UK',
    description: 'This is Onyun he is here to help you design your app he is steppiing in as a placeholder ',
    watering: 'Frequent',
    sunlight: 'little',
    maintenance:'Low',
    plant_image: 'https://www.shutterstock.com/image-vector/onion-whole-vegetable-sprigs-ink-260nw-1905285127.jpg'
  };
       
        return (
          <View style={styles.container}>
            <Text>My Plants List</Text>
            <View style={styles.plantBox}>    
            <Text style={styles.plantText}>Plant Name: {myPlant.name}</Text>             
            <Text>Watering Frequency: {myPlant.watering}</Text>
            <Text>Sunlight: {myPlant.sunlight}</Text>
            <Text>Maintenance: {myPlant.maintenance}</Text>
            <Image style={styles.tinyLogo} source={{uri:'https://images7.memedroid.com/images/UPLOADED644/57b9fb3f39d33.jpeg'} as ImageSourcePropType} /> 
            </View>

          <View style={styles.plantBox}>
          <Text style={styles.plantText}>Plant Name: {myPlant2.name}</Text>             
            <Text>Watering Frequency: {myPlant2.watering}</Text>
            <Text>Sunlight: {myPlant2.sunlight}</Text>
            <Text>Maintenance: {myPlant2.maintenance}</Text>
          </View>
          </View>         
          );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom:8,   
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
  plantText: {
    paddingBottom: 5
  },
  plantBox: {
    borderRadius: 20,
    backgroundColor: '#b3f0ff',
    padding: 6,
    borderWidth: 4,   
  },
  tinyLogo: {
    width: 100,
    height: 100,
  },
});