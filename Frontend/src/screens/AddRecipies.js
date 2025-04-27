import { StyleSheet, Text, View, Image, ScrollView, TextInput,TouchableOpacity } from 'react-native'
import React, { useEffect,useContext } from 'react'
import { useNavigation, useRoute, DrawerActions } from '@react-navigation/native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytesResumable, getDownloadURL, uploadString } from 'firebase/storage';
import { storage } from '../../config';
import { AuthContext } from "../context/AuthContext";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const AddRecipies = () => {
  const { userid } = useContext(AuthContext);
  const [errormsg, setErrorMsg] = useState(null)
  const [image, setImage] = useState(null);
  const [upload, setupload] = useState({
    idMeal:"",
    rname: "",
    region:"",
    instructions:""
  })
  const [data, setdata] = useState(null)

  const pickImage = async () => {
    if(!userid)
      alert('You need to login first')
    else{
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All, // or .VIDEO or both
        allowsEditing: true,
        aspect: [16, 16],
        quality: 1,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
        await uploadImage(result.assets[0].uri, "image")
      }
    }
  };

  async function uploadImage(uri, fileType) {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, "Stuff/" + new Date().getTime());
    const uploadTask = uploadBytesResumable(storageRef, blob);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        switch (snapshot.state) {
          case 'paused':
            break;
          case 'running':
            break;
        }
      },
      (error) => {
        switch (error.code) {
          case 'storage/unauthorized':
            break;
          case 'storage/canceled':
            break;
          case 'storage/unknown':
            break;
        }
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          upload.avatar = downloadURL;
          setdata('true')
          setImage("")
        });
      },
    );
  }
  const sendtobackend=()=>{
    if(!userid)
      alert('You need to login first to upload your recipie')
    else if(!upload.rname||!upload.region||!upload.instructions){
      alert('Fill all the details of your recipie')
    }
    else{
      fetch('http://192.168.85.156:3000/addedrecipie/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(upload)
      })
        .then(res => res.json()).then(
          data => {
            if (data.error) {
              setErrorMsg(data.error);
            }
            else {
              alert('Recipies uploaded')
            }
          }
        )
    }
  }
  return (
    <ScrollView
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{paddingBottom:hp(20)}}>
          <View style={{ padding: 20 }}>
            <TextInput
              style={[styles.input]}
              placeholder='Recipie Name'
              onChangeText={(text) => setupload({ ...upload, rname: text })}
            />
            <TextInput
              style={[styles.input]}
              placeholder='Region'
              onChangeText={(text) => setupload({ ...upload, region: text })}
            />
            <TextInput
              style={[styles.instruction]}
              placeholder='Instructions'
              multiline={true}
              onChangeText={(text) => setupload({ ...upload, instructions: text })}
            />
            <View style={{ marginTop: hp(5), flexDirection: 'column' }}>
              <TouchableOpacity style={styles.addBtn} onPress={() => { pickImage() }}>
                <Text style={styles.btnText}>Pick an image</Text>
              </TouchableOpacity>
              {image && <Image source={{ uri: image }} style={styles.image} />}
              <TouchableOpacity style={styles.addBtn} onPress={() => { sendtobackend() }}>
                <Text style={styles.btnText}>Upload Recipie</Text>
              </TouchableOpacity>
            </View>
          </View>
    </ScrollView>
  )
};

export default AddRecipies;

const styles = StyleSheet.create({
  input: {
    marginTop: 20,
    padding:10,
    paddingLeft:15,
    color: 'black',
    fontWeight: '600',
    backgroundColor: 'white',
    borderColor: 'orange',
    borderWidth: 2,
    borderRadius: 5,
    height: 50,
    fontSize: 14
  },
  instruction:{
    marginTop: 20,
    padding:10,
    paddingLeft:15,
    color: 'black',
    fontWeight: '600',
    backgroundColor: 'white',
    borderColor: 'orange',
    borderWidth: 2,
    borderRadius: 5,
    height: 400,
    fontSize: 14
  },
  addBtn: {
    width: "40%",
    height: 45,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginLeft: 110,
    backgroundColor: "orange",
  },
  btnText: {
    fontSize: 16,
    color:'black',
    fontWeight: '600'
  },
  image: {
    width: 200,
    height: 200,
  },
})