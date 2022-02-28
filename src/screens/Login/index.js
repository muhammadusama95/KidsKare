import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import ApiServices from '../../ApiServices';
import { AppColor, HP, WP } from '../../helpers';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Login = () => {
  const { navigate } = useNavigation()
  const [loading, setLoading] = useState(false)
  const [code, setCode] = useState('')
  const [schools, setSchools] = useState([])
  const [school,setSchool]=useState(0)
  const login = () => {
    setLoading(true)
      ApiServices.login(school,code, ({ isSuccess, response }) => {
        if (isSuccess) {
          if (response?.success === 1) {
              AsyncStorage.setItem("TOKEN",response.token);
            setLoading(false)
             navigate("Home")
          } else if (response?.success === 0) {
            alert(response?.message)
            setLoading(false)
          }
        } else {
          alert(response)
          setLoading(false)
        }
      })
  }
  fetchData = () => {
    ApiServices.getAllSchools(({ isSuccess, response }) => {
      if (isSuccess) {
        let arrayios=[]
        response.map((item) => {
            label = item.name;
            value = item.id;
            arrayios.push({ label: label, key: value, value: value });
        })
        setSchools(arrayios)
      }
    })
  }
  useEffect(() => {
    fetchData()
  }, [])

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={styles.headerText}>Select School and Enter Password:</Text>
      <View style={{ flexDirection: 'row' ,zIndex:10,alignItems:'center',}}>
        <Text style={{ fontSize: WP(3) }}>School: </Text>
        <DropDownPicker
          //   defaultValue={}
          items={schools}
        //  zIndex={5}
          //   placeholder={}
          arrowColor={AppColor.black}
          arrowSize={WP(2)}
          showArrow={true}
          // defaultIndex={placeholderIndex}
          onChangeItem={(item) => {
            // this.setState({
            //   placeholderIndex: 1,
            //   selectedValue: item.key,
            // });
            setSchool(item.key)
            // this.props.currencyCallback(item.key)
          }}
          selectedLabelStyle={{ color: AppColor.black }}
          containerStyle={styles.dropDownContainerStyle}
          placeholderStyle={styles.dropDownplaceholder}
          labelStyle={styles.dropDownLable}
          itemStyle={styles.dropDownItem}
          dropDownStyle={styles.dropDown}
          activeLabelStyle={styles.dropDownActiveLable}
          style={styles.mainDropDown}
          dropDownMaxHeight={WP(40)}
        />
      </View>
      <View style={{ flexDirection: 'row' ,marginTop:WP(5),alignItems:'center'}}>
        <Text style={{ fontSize: WP(3) }}>Password:</Text>
        <TextInput
          placeholder='password'
          style={{
            fontSize: WP(3), backgroundColor: '#fff',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            borderRadius: 5,
            borderWidth: 0,
            elevation: 5,
            height: WP(5),
            width: WP(46),
            paddingHorizontal:WP(2),
            marginLeft:WP(1)
          }}
          value={code}
          onChangeText={(password)=>setCode(password)}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={() => login()} disabled={loading}>
        {loading ?
          <ActivityIndicator size={"small"} color={AppColor.white} /> : <Text style={styles.buttonText}>Login</Text>}
      </TouchableOpacity>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logoImage: {
    height: HP(30),
    width: WP(50),
    marginTop: HP(10)
  },
  button: {
    width: WP(35),
    height: WP(7),
    marginTop: WP(10),
    borderRadius: WP(1),
    backgroundColor: '#0377fc',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: AppColor.white,
    fontSize: WP(4)
  },
  mask: {
    width: WP(3),
    height: WP(3),
    borderRadius: WP(2),
    backgroundColor: '#0377fc',
  },
  placeholder: {
    width: WP(3),
    height: WP(3),
    borderRadius: WP(2),
    backgroundColor: AppColor.greyBlack,
  },
  headerText: {
    marginTop: HP(10),
    marginBottom: WP(10),
    fontSize: WP(4)
  },

  dropDownplaceholder: {
    fontSize: WP(2),
    marginLeft: WP(2)
  },
  dropDownLable: {
    fontSize: WP(3),
    width: '100%',
    marginLeft: WP(1),
  },
  dropDownActiveLable: {
    fontSize: WP(4),
    fontWeight: 'bold',
  },
  dropDownItem: {
    paddingVertical: WP(2),
    zIndex: 20
  },
  dropDown: {
    zIndex: 20,
    elevation: 5,
    // marginTop:WP(10)
  },
  dropDownPicker: {
    height: WP(12),
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderRadius: 5,
    elevation: 2,
    marginHorizontal: 2
  },
  mainContainer: {
    paddingLeft: WP(3),
    marginVertical: WP(2),
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderRadius: 5,
    elevation: 5,
    fontSize: WP(3),
    borderBottomWidth: 0,
    // paddingVertical: Platform.OS == 'ios' ? 4 : 10
  },
  mainContainerRed: {
    paddingLeft: 15,
    // height: WP(12),
    marginVertical: WP(2),
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderRadius: 5,
    elevation: 5,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: 'red',
  },
  dropDownContainerStyle: {
    height: WP(5),
    width: WP(50)
    //  marginVertical: WP(3)
  },
  mainDropDown: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderRadius: 5,
    borderWidth: 0,
    elevation: 5,
    height: WP(4)
  },
  mainDropDownRed: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderRadius: 5,
    elevation: 5,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: 'red',
  },

  dropDown: {
    //zIndex: 20,
    elevation: 5,
    //marginTop:WP(10)
  },
})