import React, { useState,useContext } from "react";
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/Fontisto';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import Icon3 from 'react-native-vector-icons/Ionicons'
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";

const Signup = () => {
  const navigation = useNavigation()
  const { setuserid } = useContext(AuthContext);
  const [fdata, setFdata] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  })
  const [errormsg, setErrorMsg] = useState(null);

  const sendToBackend = () => {
    if ((fdata.name == "") || (fdata.email == "") || (fdata.dob == "") || (fdata.grade == "") || (fdata.password == "") || (fdata.conpassword == "")) {
      setErrorMsg("All fields are required")
    }
    else if (fdata.conpassword != fdata.password) {
      setErrorMsg("Confirm password not matched")
    }
    else {
      fetch('http://192.168.184.156:3000/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(fdata)
      })
        .then(res => res.json()).then(
          data => {
            if (data.error) {
              setErrorMsg(data.error);
            }
            else {
              console.log(data.uid.p)
              setuserid(data.uid.p);
              alert('Account created succesfully');
              navigation.navigate('UserDetails',{userid:data.uid.q});
            }
          }
        )
    }
  }
  return (
    <ScrollView
      style={{ backgroundColor: '#F5FCFF',flex: 1 }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: hp(8)
      }}>
      <Text style={styles.headingText}>Create account</Text>
      <View>
        {
          errormsg ? <Text style={{ marginLeft: 50, "color": "red" }}>{errormsg}</Text> : null
        }
      </View>
      <View style={styles.inputView}>
        <Icon2
          name="user"
          size={hp(3)}
          color="black"
          style={{ marginTop: hp(1.2), marginLeft: wp(5) }}
        />
        <TextInput
          style={styles.TextInput}
          placeholder="Name"
          placeholderTextColor="#000"
          onPressIn={() => setErrorMsg(null)}
          onChangeText={(text) => setFdata({ ...fdata, name: text })}
        />
      </View>
      <View style={styles.inputView}>
        <Icon1
          name="email"
          size={hp(2)}
          color="black"
          style={{ marginTop: hp(1.6), marginLeft: wp(5) }}
        />
        <TextInput
          style={styles.TextInput}
          placeholder="Email"
          placeholderTextColor="#000"
          onPressIn={() => setErrorMsg(null)}
          onChangeText={(text) => setFdata({ ...fdata, email: text })}
        />
      </View>
      <View style={styles.inputView}>
        <Icon2
          name="mobile-phone"
          size={hp(3.4)}
          color="black"
          style={{ marginTop: hp(1.2), marginLeft: wp(5), marginRight: wp(0.5) }}
        />
        <TextInput
          style={styles.TextInput}
          placeholder="Mobile No"
          placeholderTextColor="#000"
          onPressIn={() => setErrorMsg(null)}
          onChangeText={(text) => setFdata({ ...fdata, mobile: text })}
        />
      </View>
      <View style={styles.inputView}>
        <Icon2
          name="lock"
          size={hp(3)}
          color="black"
          style={{ marginTop: hp(1.2), marginLeft: wp(5) }}
        />
        <TextInput
          style={styles.TextInput}
          placeholder="Password"
          placeholderTextColor="#000"
          onPressIn={() => setErrorMsg(null)}
          onChangeText={(text) => setFdata({ ...fdata, password: text })}
        />
      </View>
      <View style={styles.inputView}>
        <Icon
          name="lock"
          size={hp(2.3)}
          color="black"
          style={{ marginTop: hp(1.5), marginLeft: wp(4) }}
        />
        <TextInput
          style={styles.TextInput}
          placeholder="Confirm Password"
          placeholderTextColor="#000"
          onPressIn={() => setErrorMsg(null)}
          onChangeText={(text) => setFdata({ ...fdata, conpassword: text })}
        />
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.createtext}>Create</Text>
        <TouchableOpacity style={styles.signupBtn}>
          <Icon3 style={styles.icon} name="arrow-forward-outline" onPress={() => sendToBackend()} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default Signup;

const styles = StyleSheet.create({
  headingText:
  {
    height: hp(12),
    marginLeft: wp(20),
    marginTop: hp(15),
    fontSize: hp(4),
    fontWeight: "500",
    color: "orange",
    marginBottom:hp(3)
  },
  inputView: {
    backgroundColor: "#fff",
    borderRadius: hp(3),
    width: wp(80),
    height: hp(6),
    marginLeft: wp(10),
    elevation: 10,
    marginBottom: hp(4),
    borderColor: 'orange',
    borderWidth: hp(0.2),
    flexDirection: "row"
  },
  TextInput: {
    flex: 1,
    padding: hp(1.5),
    "color": "#000",
    fontWeight: "bold",
    fontSize: hp(2.1),
  },
  signupBtn: {
    width: hp(8),
    borderRadius: hp(3),
    height: hp(5.5),
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(5),
    marginLeft: wp(1.5),
    backgroundColor: "#fff",
    elevation: 10,
    borderColor: 'orange',
    borderWidth: hp(0.2),
  },
  createtext:
  {
    color: "#000",
    fontSize: hp(3),
    height:hp(5),
    fontWeight: "500",
    marginTop:hp(5.5),
    marginLeft:wp(51)
  },
  icon: {
    fontSize: hp(4),
    color: "orange"
  },
});