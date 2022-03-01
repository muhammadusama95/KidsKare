import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import moment from 'moment'
import { CheckBox } from 'react-native-elements';
import DropDownPicker from 'react-native-dropdown-picker';
import ApiServices from "../../ApiServices";
import { AppColor, WP } from '../../helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";

const Home = () => {

  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState(null)
  const [final, setFinal] = useState(false)
  const [nap, setNap] = useState(false)
  const [bus, setBus] = useState(false)
  const [sortBy, setSortByList] = useState([{ label: 'First Name', key: 0, value: 0 }, { label: 'Last Name', key: 1, value: 1 }])
  const [classes, setClasses] = useState([])
  const [busList, setBusList] = useState([])
  const [sortByValue, setSortByValue] = useState(0)
  const [selectedClass, setSelectedClass] = useState(0)
  const [selectedBus, setSelectedBus] = useState(0)
  const [children, setChildren] = useState([])
  const [isConnected, setConnected] = useState(false)


  const getClasses = (token) => {
    ApiServices.getClasses(token, ({ isSuccess, response }) => {
      if (isSuccess) {
        let arrayios = []
        response?.map((item) => {
          label = item.name;
          value = item.id;
          arrayios.push({ label: label, key: value, value: value });
        })
        setClasses(arrayios)
      } else {
        alert(response)
      }
    })
  }

  const getBusses = (token) => {
    ApiServices.getBusses(token, ({ isSuccess, response }) => {
      if (isSuccess) {
        let arrayios = []
        response?.map((item) => {
          label = item.name;
          value = item.id;
          arrayios.push({ label: label, key: value, value: value });
        })
        setBusList(arrayios)
      } else {
        alert(response)

      }
    })
  }

  const getChildren = (token) => {
    ApiServices.getChildren(token, ({ isSuccess, response }) => {
      if (isSuccess) {
        setChildren(response)
      } else {
        alert(response)
      }
    })
  }

  fetchData = async () => {
    let token = await AsyncStorage.getItem('TOKEN')
    setToken(token)
    if (token) {
      await getClasses(token)
      await getChildren(token)
      await getBusses(token)

    }
    setLoading(false)
  }


  const onPress = async (item, index) => {

    let arr = [...children]
    let data = { 
      type : 'toggle',
      data : []
    }
    arr[index].selected = arr[index]?.selected == undefined ? arr[index].selected = true : !arr[index]?.selected

    let locallySavedArray = await AsyncStorage.getItem("roll_call_array")
    locallySavedArray = JSON.parse(locallySavedArray)

    if (locallySavedArray != null) {
      locallySavedArray.forEach(element => {
        data.data.push(element)
      });
    }
    if (arr[index].roll_calls.length === 0) {
      data.data.push({
        action: nap ? 'nap' : 'in',
        child: arr[index].id,
        nap: 0,
        timestamp: new Date()
      })
    } else {
      data.data.push({
        action: arr[index].roll_calls[arr[index].roll_calls.length - 1].direction !== 'out' ? 'out' : nap ? 'nap' : 'in',
        child: arr[index].id,
        nap: 0,
        timestamp: new Date()
      })
    }


    let forLocalArray = {
      direction: data.data[data.data.length-1].action,
      id: moment(data.data[data.data.length-1].timestamp, 'h:mm:ss A"').valueOf(),
      time: moment(data.data[data.data.length-1].timestamp).format('h:mm:ss A')
    }
    arr[index].roll_calls.push(forLocalArray)

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        console.log("PARAMS",data)
        ApiServices.checkInOut(token, data, ({ isSuccess, response }) => {
          console.log("Response", response)
          AsyncStorage.removeItem("roll_call_array")
        })
      } else {
        AsyncStorage.setItem("roll_call_array", JSON.stringify(data.data))
      }
    });
    setChildren(arr)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.rowDirection}>
        <View style={styles.left_bar}>
          <View style={styles.school_info}>
            <Text style={styles.textBold}>Kids Kare El Paseo</Text>
            <Text style={styles.school_admin}>Hayes/Herndon</Text>
            <Text style={styles.school_addr}>Fresno, CA 93711 (559) 275-1169</Text>
          </View>
          <View style={styles.school_info}>
            <Text style={styles.textBold}>Daily Roll Call Sheet</Text>
            <Text style={styles.school_admin}>{moment().format('dddd  MM/DD/YYYY')}</Text>
          </View>
        </View>
        <View style={styles.right_bar}>
          <View>
            <View style={styles.dropDownViews}>
              <Text style={{ fontSize: WP(2) }}>Sort By:</Text>
              <DropDownPicker
                items={sortBy}
                arrowColor={AppColor.black}
                arrowSize={WP(2)}
                showArrow={true}
                onChangeItem={(item) => {
                  setSortByValue(item.key)
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
            <View style={styles.dropDownViews}>
              <Text style={{ fontSize: WP(2) }}>Class:</Text>
              <DropDownPicker
                items={classes}
                arrowColor={AppColor.black}
                arrowSize={WP(2)}
                showArrow={true}
                onChangeItem={(item) => {
                  setSortByValue(item.key)
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
            {bus ?
              <View style={styles.dropDownViews}>
                <Text style={{ fontSize: WP(2) }}>Bussing School:</Text>
                <DropDownPicker
                  items={busList}
                  zIndex={10}
                  arrowColor={AppColor.black}
                  arrowSize={WP(2)}
                  showArrow={true}
                  onChangeItem={(item) => {
                    setSortByValue(item.key)
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
              </View> : null}
          </View>
          <View style={{ justifyContent: 'space-between' }}>
            <CheckBox
              title={"Final"}
              checked={final}
              checkedColor={AppColor.purple}
              onPress={() => { setFinal(!final) }}
              containerStyle={styles.checkBoxContainerStyle}
              wrapperStyle={styles.checkBoxWrapperStyle}
              textStyle={styles.checkBoxTextStyle}
              size={WP(3)}
            />
            <CheckBox
              title={"Nap"}
              checked={nap}
              checkedColor={AppColor.purple}
              onPress={() => { setNap(!nap) }}
              containerStyle={styles.checkBoxContainerStyle}
              wrapperStyle={styles.checkBoxWrapperStyle}
              textStyle={styles.checkBoxTextStyle}
              size={WP(3)}
            />
            <CheckBox
              title={"Bus"}
              checked={bus}
              checkedColor={AppColor.purple}
              onPress={() => { setBus(!bus) }}
              containerStyle={styles.checkBoxContainerStyle}
              wrapperStyle={styles.checkBoxWrapperStyle}
              textStyle={styles.checkBoxTextStyle}
              size={WP(3)}
            />
          </View>
        </View>
      </View>
      <ScrollView style={styles.enroll}>
        <FlatList data={children}
          style={{ paddingBottom: WP(5) }}
          renderItem={({ item, index }) => {
            return (
              <View style={[styles.enrollItem, { backgroundColor: index % 2 == 0 ? AppColor.lightGrey : 'white' }]}>
                <TouchableOpacity style={[styles.width40, { backgroundColor: item.selected ? 'green' : 'black' }]} onPress={() => onPress(item, index)}>
                  <View style={styles.btn_enroll}>
                    <Text style={{ color: 'white', fontSize: WP(2) }}>{item.fname + " " + item.lname}</Text>
                    <Text style={{ color: 'white', fontSize: WP(2) }}>{item.enrollment_display}</Text>
                  </View>
                </TouchableOpacity>
                <FlatList data={item.roll_calls}
                  style={{}}
                  renderItem={({ item, index }) => {
                    return (
                      <TouchableOpacity style={styles.chkItem}>
                        <View>
                          <Text style={styles.time}>{item.time}</Text>
                        </View>
                        <View style={[styles.chkRightView, {
                          backgroundColor: item.direction == 'out' ? '#6e62ac' : item.direction == 'in' ? '#07abe0' : item.direction == 'nap' ? '#028804' : 'white'
                        }]}>
                          <Text style={styles.school_addr}>{item.direction == 'out' ? 'OUT' : item.direction == 'in' ? 'IN' : item.direction == 'nap' ? 'NAP' : ''}</Text>
                        </View>
                      </TouchableOpacity>
                    )
                  }}
                  numColumns={3}
                  keyExtractor={(item, index) => index}
                />
              </View>
            )
          }}
          keyExtractor={(item, index) => index}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  left_bar: {
    flexDirection: 'row',
    justifyContent: "space-between",
    width: '50%',
    marginTop: WP(2),
  },
  right_bar: {
    marginTop: WP(3),
    flexDirection: 'row',
  },
  school_info: {
    justifyContent: "center",
    alignItems: "center",
    width: '50%',
  },
  rowDirection: {
    flexDirection: 'row',
    borderBottomWidth: 3,
    zIndex: 10,
    justifyContent: 'space-between'
  },
  textBold: {
    fontWeight: 'bold',
    fontSize: WP(3.5)
  },
  school_addr: {
    fontSize: WP(2),
    color: 'white'
  },
  time: {
    fontSize: WP(2),
    color: 'black'
  },
  school_admin: {
    fontSize: WP(2.75)
  },
  enroll: {
    flex: 1,
    marginTop: WP(2),
    padding: WP(3)
  },
  enrollItem: {
    flexDirection: "row",
    marginBottom: WP(2),
    padding: WP(2)
  },
  width40: {
    width: WP(35),
    justifyContent: 'center',
    borderRadius: WP(5),
    height: WP(10),
    backgroundColor: 'black',
    borderColor: 'white',
    borderWidth: 2,
    padding: WP(2)
  },
  btn_enroll: {
    justifyContent: 'center',
  },
  chkItem: {
    paddingLeft: WP(1),
    height: WP(6),
    width: WP(18),
    borderRadius: WP(10),
    flexDirection: 'row',
    margin: WP(1),
    justifyContent: 'space-between',
    alignItems: "center",
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'grey',
  },
  checkBoxContainerStyle: {
    height: WP(4),
    justifyContent: 'center',
    width: WP(10),
  },
  checkBoxWrapperStyle: {
    height: WP(4),
    width: WP(10),
  },
  checkBoxTextStyle: {
    fontSize: WP(2),
    color: AppColor.black,
    fontWeight: '500',
  },
  chkRightView: {
    height: WP(6),
    width: WP(5),
    borderBottomEndRadius: WP(11),
    borderTopEndRadius: WP(11),
    justifyContent: 'center',
    alignItems: 'center'
  },
  dropDownViews: {
    flexDirection: 'row',
    zIndex: 20,
    alignItems: 'center',
    marginBottom: WP(1),
    width: WP(35),
    justifyContent: 'space-between'
  },

  dropDownplaceholder: {
    fontSize: WP(2),
    marginLeft: WP(2)
  },
  dropDownLable: {
    fontSize: WP(2),
    width: '100%',
    marginLeft: WP(1),
  },
  dropDownActiveLable: {
    fontSize: WP(2),
    fontWeight: 'bold',
  },
  dropDownItem: {
    paddingVertical: WP(2),
    zIndex: 20
  },
  dropDown: {
    zIndex: 20,
    elevation: 5,
  },
  dropDownContainerStyle: {
    height: WP(5),
    width: WP(20)
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
});
export default Home;