import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Button } from 'react-native-elements/dist/buttons/Button';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Alert,
  SafeAreaView,
  Image
} from 'react-native';
import moment, { min } from 'moment'
import { CheckBox } from 'react-native-elements';
import DropDownPicker from 'react-native-dropdown-picker';
import ApiServices from "../../ApiServices";
import { AppColor, WP } from '../../helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";
import { Modal, ModalContent } from "react-native-modals";
import { hours, minutes, AMPM, type } from '../../helpers/Constants';
//import { SafeAreaView } from 'react-native-safe-area-context';

const Array = ["Hello", "ANDknad", "ALDNlaskdn"]
const Home = () => {

  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState(null)
  const [schoolName, setSchoolName] = useState(null)
  const [address, setSchoolAddress] = useState(null)
  const [city, setSchoolCity] = useState(null)
  const [final, setFinal] = useState(false)
  const [nap, setNap] = useState(false)
  const [bus, setBus] = useState(false)
  const [sortBy, setSortByList] = useState([{ label: 'First Name', key: 0, value: 0 }, { label: 'Last Name', key: 1, value: 1 }])
  const [classes, setClasses] = useState([])
  const [busList, setBusList] = useState([])
  const [sortByClass, setSortByClass] = useState(0)
  const [sortByName, setSortByName] = useState(0)
  const [sortByValue, setSortByValue] = useState(0)
  const [selectedClass, setSelectedClass] = useState(0)
  const [selectedBus, setSelectedBus] = useState(0)
  const [children, setChildren] = useState([])
  const [isConnected, setConnected] = useState(true)
  const [displayNetworkState, setdisplayNetworkState] = useState(true)
  const [isVisible, setVisible] = useState(false)
  const [modalHour, setHour] = useState(1)
  const [modalMinute, setMinute] = useState(0)
  const [modalSec, setSec] = useState(0)
  const [modalAMPM, setAMPM] = useState(0)
  const [modalType, setType] = useState(0)
  const [selectedItem, setItem] = useState(null)
  const dropDown1 = React.useRef();
  const dropDown2 = React.useRef();
  const dropDown3 = React.useRef();
  const dropDown4 = React.useRef();
  const dropDown5 = React.useRef();
  const interval = useRef(null)
  const mainArray = useRef([]);
  const connectionAlertDisplaye = useRef(false)
  // const isConnected = useRef(null)

  // const unsubscribe = NetInfo.addEventListener((state) => {

  //   isConnected.current = state.isConnected
  // })

  // useMemo(() => {
  //   console.log("FMAKOFNOSKn",isConnected.current)
  //   if(!isConnected.current)
  //   setdisplayNetworkState(true)
  //   return {};
  // }, [isConnected.current]);

  useEffect(() => {
    // interval.current = setInterval(() => {
    //   console.log("On Refreshing Data");

    const removeNetInfoSubscription = NetInfo.addEventListener((state) => {

      const offline = !(state.isConnected && state.isInternetReachable);
      console.log("OnEventChangeLog", state.isConnected + "" + "" + state.isWifiEnabled);
      if(!displayNetworkState&&state.isConnected)
      {
        fetchData()
      }

      setdisplayNetworkState(state.isConnected)

      //setOfflineStatus(offline);
    });

    // fetchData()

    return () => removeNetInfoSubscription();
    //Yeh wala function tha jo ghalat response deta tha. Agar check karna to isay uncomment ker le or wifi off ker ke
    //On ker. Result mil jaye ga.  


    // }, 60000);

  }, [])


  useEffect(() => {
    // setInterval(()=>{
    //   NetInfo.fetch().then(state => {
    //     // alert(connectionAlertDisplaye.current + " " + state.isConnected )
    //     if (!connectionAlertDisplaye.current && !state.isConnected) {
    //       connectionAlertDisplaye.current = true
    //       setConnected(false)
    //       setdisplayNetworkState(true)
    //       setTimeout(() => {
    //         setdisplayNetworkState(false)
    //       }, 5000)
    //     }
    //   })
    // },60000)

    // return () => {
    //   console.log("CLEARED")
    //   clearInterval(interval.current)
    //   // unsubscribe()
    // }
    // return () => {
    //   console.log("CLEARED")
    //   clearInterval(interval.current)

    // }
  }, [])


  const getClasses = (token) => {
    ApiServices.getClasses(token, ({ isSuccess, response }) => {
      if (isSuccess) {
        let arrayios = []
        let allClasses = {
          label: "All Classes",
          key: "ac",
          value: "ac"
        }
        arrayios.push(allClasses)
        response?.map((item) => {
          label = item.name;
          value = item.id;
          arrayios.push({ label: label, key: value, value: value });
        })
        AsyncStorage.setItem("classes", JSON.stringify(arrayios));
        setClasses(arrayios)
      } else {
        // alert(response)
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
        setdisplayNetworkState(true)
        AsyncStorage.setItem("busses", JSON.stringify(arrayios));
        setBusList(arrayios)
      } else {
        setdisplayNetworkState(false)
        // alert(response)

      }
    })
  }

  const getChildren = (token) => {

    ApiServices.getChildren(token, ({ isSuccess, response }) => {
      if (isSuccess) {
        console.log(JSON.stringify(response))
        AsyncStorage.setItem("childsdata", JSON.stringify(response));
        mainArray.current = []
        mainArray.current = response
        setChildren(response)
        filterChild()
        setdisplayNetworkState(true)
      } else {
        setdisplayNetworkState(false)
        //alert(response)
      }
    })
  }
  const getCheckInOut = (token, data, key) => {
    ApiServices.checkInOut(token, data, ({ isSuccess, response }) => {
      console.log("Response" + key, response)
      if (isSuccess) {
        // if (connectionAlertDisplaye.current) {
        //   connectionAlertDisplaye.current = false
        //   setConnected(true)
        //   setdisplayNetworkState(true)
        //   setTimeout(() => {
        //     setdisplayNetworkState(false)
        //   }, 5000)
        // }
        // response.errors[0] == "Error getting old entry!"
        setdisplayNetworkState(true)
        AsyncStorage.removeItem(key)
        getChildren(token)
      } else {
        setdisplayNetworkState(false)
        // setConnected(false)
        // setdisplayNetworkState(true)
        // connectionAlertDisplaye.current = false
        // setTimeout(() => {
        //   setdisplayNetworkState(false)
        // }, 5000)
        console.log("Keep Data on hold for " + key)
      }
    })
  }

  fetchData = async () => {


  //  await NetInfo.fetch().then(state => {
  
  //     console.log("State",state.isConnected)
      setdisplayNetworkState(true)
    
    //})




    let data = {
      type: 'toggle',
      data: []
    }
    let token = await AsyncStorage.getItem('TOKEN')
    let childArray = await AsyncStorage.getItem("childsdata")
    let busses = await AsyncStorage.getItem("busses")
    let classes = await AsyncStorage.getItem("classes")
    let Login = await AsyncStorage.getItem("Login")
    let checkInCheckOutDataForUploading = await AsyncStorage.getItem("roll_call_array")
    let updateForUploading = await AsyncStorage.getItem("roll_call_array_update")
    let deleteForUploading = await AsyncStorage.getItem("roll_call_array_delete")
    let params = {
      type: "updateentry",
      entries: []
    }
    updateForUploading = JSON.parse(updateForUploading);
    console.log("updateEntry", updateForUploading)
    if (updateForUploading != null) {

      updateForUploading.forEach(element => {
        params.entries.push(element)
      });
      console.log("updateEntry", params)
    }

    await getCheckInOut(token, params, "roll_call_array_update")


    let deleteParams = {
      type: "removeentry",
      entries: []
    }
    deleteForUploading = JSON.parse(deleteForUploading);
    console.log("deleteEntry", deleteForUploading)
    if (deleteForUploading != null) {
      deleteForUploading.forEach(element => {
        deleteParams.entries.push(element)
      });
      // deleteParams.entries=updateForUploading;
      console.log("deleteEntry", deleteParams)

      await getCheckInOut(token, deleteParams, "roll_call_array_delete")
    }




    console.log("checkInCheckOut", checkInCheckOutDataForUploading)
    checkInCheckOutDataForUploading = JSON.parse(checkInCheckOutDataForUploading)
    if (checkInCheckOutDataForUploading != null) {
      checkInCheckOutDataForUploading.forEach(element => {
        data.data.push(element)
      });
      //data.data=checkInCheckOutDataForUploading;

      await getCheckInOut(token, data, "roll_call_array")
    }





    if (Login != null) {
      Login = JSON.parse(Login)
      setSchoolName(Login.school.name)
      setSchoolAddress(Login.school.address)
      setSchoolCity(Login.school.city + ", " + Login.school.state + " " + Login.school.zip + " " + Login.school.phone)

    }

    if (childArray != null) {
      childArray = JSON.parse(childArray)
      mainArray.current = childArray
      setChildren(childArray);
    }



    busses = JSON.parse(busses)
    let arrayiosbusses = []
    if (busses != null) {

      busses?.map((item) => {
        label = item.label;
        value = item.key;
        arrayiosbusses.push({ label: label, key: value, value: value });
      })
      setBusList(arrayiosbusses);
    }
    classes = JSON.parse(classes)
    let arrayiosclasses = []
    if (classes != null) {
      classes?.map((item) => {
        label = item.label;
        value = item.key;
        arrayiosclasses.push({ label: label, key: value, value: value });
      })
      setClasses(arrayiosclasses);
    }

    setToken(token)
    if (token) {
      await getChildren(token)
      await getClasses(token)
      await getBusses(token)





    }
    setLoading(false)
  }

  const getType = (direction) => {
    if (direction == 'in') {
      return 0
    }
    else if (direction == 'out') {
      return 1
    }
    else {
      return 2
    }
  }
  const showModal = (item) => {
    let now = moment(item.time, 'hh:mm:ss')
    console.log(now.hour() === 0 ? 12 : now.hour())
    console.log(item)
    setHour(now.hour() === 0 ? 12 : now.hour())
    setMinute(now.minute())
    setSec(now.second())
    setAMPM(item.time.slice(-2) === 'AM' ? 0 : 1)
    setType(getType(item.direction))
    setVisible(true)

  }

  useEffect(() => {
    filterChild()
  }, [bus, final, nap, sortByClass, sortByName, sortByValue])


  const filterChild = async () => {
    let allChildren = []

    // allChildren=JSON.parse(allChildren)



    for (let i = 0; i < mainArray.current.length; i++) {
      if (final) {
        // console.log("TotalRollCalls",)
        if (mainArray.current[i].roll_calls.length >= 1) {
          if (mainArray.current[i].roll_calls[mainArray.current[i].roll_calls.length - 1].direction == "nap" || mainArray.current[i].roll_calls[mainArray.current[i].roll_calls.length - 1].direction == "in") {
            allChildren.push(mainArray.current[i])
          }
        }
      }
      if (nap) {
        if (mainArray.current[i].grade !== 5) {
          allChildren.push(mainArray.current[i])
        }
      } else if (bus) {

        if (mainArray.current[i].grade === 5) {
          if (sortByValue === 0 || sortByValue === "" || sortByValue === 'C') {
            allChildren.push(mainArray.current[i])
          } else {
            if (mainArray.current[i].bus === sortByValue) {
              allChildren.push(mainArray.current[i])
            }
          }
        }
      }
      if (sortByClass !== 0) {

        if (sortByClass === 'Todd' && mainArray.current[i].grade == 1) {
          allChildren.push(mainArray.current[i])
        }
        else if (sortByClass === 'PS' && (mainArray.current[i].grade == 2 || mainArray.current[i].grade == 3 || mainArray.current[i].grade == 4)) {
          allChildren.push(mainArray.current[i])
        }
        else if (sortByClass === 'GS' && (mainArray.current[i].class == 9 || mainArray.current[i].class == 10)) {
          allChildren.push(mainArray.current[i])
        } else if (sortByClass == mainArray.current[i].class) {
          allChildren.push(mainArray.current[i])
        }
      }
      if ((sortByClass === "ac" || sortByClass == 0) && (sortByValue == 0) && !nap && !bus && !final) {
        allChildren.push(mainArray.current[i])
      }
    }



    allChildren = allChildren.sort(function (a, b) {
      if (sortByName == 1) {
        if (a.fname < b.fname) { return -1; }
        if (a.fname > b.fname) { return 1; }
      } else {
        if (a.lname < b.lname) { return -1; }
        if (a.lname > b.lname) { return 1; }
      }
      return 0;
    })

    setChildren(allChildren)

  }

  const checkFinal = (item) => {
    console.log("ITEM", item)
    return item.fname === "Kid1";
  }
  // useEffect(()=>{

  //   console.log("Time ",aas)


  // },[])

  const updateEntry = async () => {
    let allChildren = [...children]
    let arr = allChildren[selectedItem.index].roll_calls
    let direction = modalType === 0 ? 'in' : modalType === 1 ? 'out' : 'nap'
    let ampm = modalAMPM === 0 ? 'am' : 'pm'
    var foundIndex = arr.findIndex(x => x.id == selectedItem.id);
    // arr.map((item)=> selectedItem.id === element.id ? {...element, direction : 'yes'} : {...element, direction : 'no'} )

    console.log(modalMinute)
    let hour = modalHour < 10 ? '0' + modalHour : modalHour
    let minute = modalMinute < 10 ? '0' + modalMinute : modalMinute
    let secs = modalSec < 10 ? "0" + modalSec : modalSec

    console.log(minute)

    arr[foundIndex] = {
      id: selectedItem.id,
      direction: direction,
      time: hour
        + ':' +
        minute
        + ":" +
        secs
        + " " +
        ampm
    }

    let checkInCheckOutDataForUploading = await AsyncStorage.getItem("roll_call_array")
    console.log("checkInCheckOut", checkInCheckOutDataForUploading)
    checkInCheckOutDataForUploading = JSON.parse(checkInCheckOutDataForUploading)
    if (checkInCheckOutDataForUploading != null)  //its means there are some entries check if user is not editing this.
    {



      // console.log("selectedItem.id", selectedItem.id)
      // console.log(checkInCheckOutDataForUploading[0].id)
      // console.log(moment(checkInCheckOutDataForUploading[0].timestamp, 'h:mm:ss A"').valueOf())
      var checkUpdateEntryIndex = checkInCheckOutDataForUploading.findIndex(x => x.id == selectedItem.id);
      console.log("checkUpdateEntryIndex", checkUpdateEntryIndex)


      //  //2022-03-13T11:35:50.323Z
      // 
      // time: 12  + ':' +    20       + ":" +       20       + " " +       pm


      //   //myarray[1]=11:35:50.323Z
      //   const timeArray=myArray[myArray.length-1].split(":")
      //   //timeArray[0]=11
      //   //timeArray[0]=11
      //   //timeArray[0]=11
      if (checkUpdateEntryIndex != -1) {
        //   hour=hour+5;

        //   if(hour>=12)
        // {
        //   hour=hour%12
        //   ampm=ampm==="AM"?"PM":"AM"
        // }
        let time = hour + ':' + minute + ":" + secs + " " + ampm
        console.log("IndexValue", JSON.stringify(checkInCheckOutDataForUploading[checkUpdateEntryIndex]))
        console.log("TIMESTAMP", checkInCheckOutDataForUploading[checkUpdateEntryIndex].timestamp)
        const myArray = checkInCheckOutDataForUploading[checkUpdateEntryIndex].timestamp.split("T");
        time = +myArray[0] + " " + time;
        let aas = moment(time, "YYYY-MM-DD hh:mm:ss A")
        if (aas) {
          checkInCheckOutDataForUploading[checkUpdateEntryIndex].timestamp = aas;
        }
        console.log("TIMESTAMPAFTER__TIME", time)
        checkInCheckOutDataForUploading[checkUpdateEntryIndex].action = direction;

        AsyncStorage.setItem("roll_call_array", JSON.stringify(checkInCheckOutDataForUploading))

        allChildren[selectedItem.index].roll_calls = arr
        // console.log(allChildren[selectedItem.index].roll_calls)
        setChildren(allChildren)
        setVisible(false)
        return;
      }

    }




    allChildren[selectedItem.index].roll_calls = arr
    // console.log(allChildren[selectedItem.index].roll_calls)
    setChildren(allChildren)
    AsyncStorage.setItem("childsdata", JSON.stringify(allChildren))

    let previousArray = await AsyncStorage.getItem("roll_call_array_update")
    let currentEntry = {
      "entry": selectedItem.id,
      "hour": modalHour,
      "minute": modalMinute,
      "second": modalSec,
      "ampm": ampm,
      "direction": direction
    }


    let entries = previousArray !== null ? JSON.parse(previousArray) : []

    entries.push(currentEntry)

    let params = {
      type: "updateentry",
      entries: entries
    }

    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        console.log("PARAMS", params)
        ApiServices.checkInOut(token, params, ({ isSuccess, response }) => {
          if (isSuccess) {
            console.log("Response", response)
            AsyncStorage.removeItem("roll_call_array_update")
            getChildren(token)
            setdisplayNetworkState(true)
          } else {
            setdisplayNetworkState(false)
            AsyncStorage.setItem("roll_call_array_update", JSON.stringify(entries))
          }
        })
      } else {
        setdisplayNetworkState(false)
        console.log("PARAMSPUT", params)
        AsyncStorage.setItem("roll_call_array_update", JSON.stringify(entries))
      }
    });

    setVisible(false)

  }

  const networkDetection = async () => {
    // NetInfo.isConnected.fetch().then(isConnected => {
    //   console.log('First, is ' + (isConnected ? 'online' : 'offline'));
    // });

    // NetInfo.isConnected.addEventListener(
    //   'connectionChange',
    //   handleFirstConnectivityChange
    // );
  }

  const deleteEntry = async (item) => {
    let allChildren = [...children]
    let arr = allChildren[selectedItem.index].roll_calls
    var foundIndex = arr.findIndex(x => x.id == selectedItem.id);
    let checkInCheckOutDataForUploading = await AsyncStorage.getItem("roll_call_array")
    console.log("checkInCheckOut", checkInCheckOutDataForUploading)
    checkInCheckOutDataForUploading = JSON.parse(checkInCheckOutDataForUploading)
    if (checkInCheckOutDataForUploading != null)  //its means there are some entries check if user is not editing this.
    {
      var checkUpdateEntryIndex = checkInCheckOutDataForUploading.findIndex(x => x.id == selectedItem.id);
      console.log("checkRemoveEntryIndex", checkUpdateEntryIndex)
      //  //2022-03-03T11:35:50.323Z
      //   const myArray = checkInCheckOutDataForUploading[checkUpdateEntryIndex].timestamp.split("T");
      //   //myarray[0]=2022-03-03
      //   //myarray[1]=11:35:50.323Z
      //   const timeArray=myArray[myArray.length-1].split(":")
      //   //timeArray[0]=11
      //   //timeArray[0]=11
      //   //timeArray[0]=11
      if (checkUpdateEntryIndex != -1) {
        checkInCheckOutDataForUploading.splice(checkUpdateEntryIndex, 1)
        console.log(JSON.stringify(checkInCheckOutDataForUploading))
        AsyncStorage.setItem("roll_call_array", JSON.stringify(checkInCheckOutDataForUploading))
        console.log("Items", JSON.stringify(arr))
        console.log("ItemsIndex", foundIndex)
        arr.splice(foundIndex, 1)
        allChildren[selectedItem.index].roll_calls = arr
        // console.log(allChildren[selectedItem.index].roll_calls)
        setChildren(allChildren)
        setVisible(false)
        return;
      }

    }


    let previousArray = await AsyncStorage.getItem("roll_call_array_delete")

    let entries = previousArray !== null ? JSON.parse(previousArray) : []

    arr.splice(foundIndex, 1)
    entries.push({
      entry: selectedItem.id
    })

    let params = {
      type: "removeentry",
      entries: entries
    }
    allChildren[selectedItem.index].roll_calls = arr
    AsyncStorage.setItem("childsdata", JSON.stringify(allChildren))
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        console.log("PARAMS", params)
        ApiServices.checkInOut(token, params, ({ isSuccess, response }) => {
          if (isSuccess) {
            console.log("Response", response)
            AsyncStorage.removeItem("roll_call_array_delete")
            getChildren(token)
            setdisplayNetworkState(true)
          } else {
            setdisplayNetworkState(false)
            AsyncStorage.setItem("roll_call_array_delete", JSON.stringify(entries))
          }
        })
      } else {
        setdisplayNetworkState(false)
        console.log("PARAMSDelete", JSON.stringify(entries))
        AsyncStorage.setItem("roll_call_array_delete", JSON.stringify(entries))
      }
    });
    setVisible(false)
  }


  const onPress = async (item, index) => {

    let arr = [...children]
    let data = {
      type: 'toggle',
      data: []
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
        nap: nap ? 1 : 0,
        timestamp: new Date()
      })

    } else {
      data.data.push({
        action: arr[index].roll_calls[arr[index].roll_calls.length - 1].direction !== 'out' ? 'out' : nap ? 'nap' : 'in',
        child: arr[index].id,
        nap: nap ? 1 : 0,
        timestamp: new Date(),
        id: moment(new Date(), 'h:mm:ss A"').valueOf()
      })
    }


    let forLocalArray = {
      direction: data.data[data.data.length - 1].action,
      id: data.data[data.data.length - 1].id,
      time: moment(data.data[data.data.length - 1].timestamp).format('h:mm:ss A'),
    }
    arr[index].roll_calls.push(forLocalArray)


        console.log("PARAMS", data)
        ApiServices.checkInOut(token, data, ({ isSuccess, response }) => {
          console.log("Response", response)
          if (isSuccess) {
            setdisplayNetworkState(true)
            AsyncStorage.removeItem("roll_call_array")
            console.log("Data is Removing")
            getChildren(token)
          } else {
            setdisplayNetworkState(false)
            AsyncStorage.setItem("roll_call_array", JSON.stringify(data.data))
            console.log("Keeps the data on hold")
          }
        })
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {!displayNetworkState ? <View style={{ flexDirection: 'row', width: '100%', height: 30, alignItems: 'center',justifyContent: 'center', backgroundColor: "#f50014" }}>
        <Text style={{ textAlign: 'center', color: '#fff', fontSize: WP(4) }}>{!isConnected ? "Internet is not available" : "Internet is not available"}</Text>
        <TouchableOpacity onPress={() => {
                fetchData()
            }
          }  style={{color: 'black',fontSize: WP(1), alignItems: 'center',justifyContent: 'center',width: 100, height: 30, margin: 8, borderRadius: 6, backgroundColor: 'white' }} >
            <Text  style={{ color: 'red',textAlign: 'center' }} >Retry/Sync
            
            </Text> 
        </TouchableOpacity>
      </View> : null}
      <View style={styles.rowDirection}>
        <View style={styles.left_bar}>
          <View style={styles.school_info}>
            <Text style={styles.textBold}>{schoolName}</Text>
            <Text style={styles.school_admin}>{address}</Text>
            <Text style={styles.school_addr}>{city}</Text>
          </View>
          <View style={styles.school_info}>
            <Text style={styles.textBold}>Daily Roll Call Sheet</Text>
            <Text style={styles.school_admin}>{moment().format('dddd  MM/DD/YYYY')}</Text>
          </View>
        </View>
        <View style={styles.right_bar}>
          <View>
            <View style={styles.dropDownView1}>
              <Text style={{ fontSize: WP(2) }}>Sort By:</Text>
              <DropDownPicker
                items={sortBy}
                arrowColor={AppColor.black}
                arrowSize={WP(2)}
                showArrow={true}
                onChangeItem={(item) => {
                  setSortByName(item.key)
                }}
                defaultValue={0}
                selectedLabelStyle={{ color: AppColor.black }}
                containerStyle={styles.dropDownContainerStyle}
                placeholderStyle={styles.dropDownplaceholder}
                labelStyle={styles.dropDownLable}
                itemStyle={styles.dropDownItem}
                dropDownStyle={styles.dropDown}
                textStyle={{ color: 'red' }}
                activeLabelStyle={styles.dropDownActiveLable}
                style={styles.mainDropDown}
                dropDownMaxHeight={WP(40)}
              />
            </View>
            <View style={styles.dropDownView2}>
              <Text style={{ fontSize: WP(2) }}>Class:</Text>
              <DropDownPicker
                items={classes}
                arrowColor={AppColor.black}
                arrowSize={WP(2)}
                showArrow={true}
                onChangeItem={(item) => {
                  setSortByClass(item.key)
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
              <View style={styles.dropDownView3}>
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
              onPress={() => {
                setFinal(!final)

                if (nap) {
                  setNap(!nap)
                }
                if (bus) {
                  setBus(!bus)
                }


                // filterChild()
              }}
              containerStyle={styles.checkBoxContainerStyle}
              wrapperStyle={styles.checkBoxWrapperStyle}
              textStyle={styles.checkBoxTextStyle}
              size={WP(3)}
            />
            <CheckBox
              title={"Nap"}
              checked={nap}
              checkedColor={AppColor.purple}
              onPress={() => {

                setNap(!nap)
                if (bus) {
                  setBus(!bus)
                }
                if (final) {
                  setFinal(!final)
                }
                // filterChild();

              }}
              containerStyle={styles.checkBoxContainerStyle}
              wrapperStyle={styles.checkBoxWrapperStyle}
              textStyle={styles.checkBoxTextStyle}
              size={WP(3)}
            />
            <CheckBox
              title={"Bus"}
              checked={bus}
              checkedColor={AppColor.purple}
              onPress={() => {
                setBus(!bus)
                if (nap) {
                  setNap(!nap)
                }
                if (final) {
                  setFinal(!final)
                }
                // filterChild()
              }}
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
                <TouchableOpacity style={[styles.width40, { backgroundColor: item.roll_calls.length >= 1 ? item.roll_calls[item.roll_calls.length - 1].direction == 'out' ? 'black' : 'green' : 'black' }]} onPress={() => onPress(item, index)}>
                  <Image source={require('../../helpers/theme/icons8-clock-128.png')} style={{ height: WP(5), width: WP(5), tintColor: item.roll_calls.length >= 1 ? item.roll_calls[item.roll_calls.length - 1].direction == 'out' ? 'white' : null : 'white' }} />
                  <View style={styles.btn_enroll}>
                    <Text style={{ color: 'white', fontSize: WP(2) }}>{item.fname + " " + item.lname}</Text>
                    <Text style={{ color: 'white', fontSize: WP(2) }}>{item.enrollment_display}</Text>
                  </View>
                </TouchableOpacity>
                <FlatList data={item.roll_calls}
                  style={{}}
                  renderItem={({ item }) => {
                    return (
                      <TouchableOpacity style={styles.chkItem} onPress={() => {
                        let mainIndex = { ...item, index: index }
                        showModal(mainIndex)
                        setItem(mainIndex)
                      }}>
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
                  numColumns={2}
                  keyExtractor={(item, index) => index}
                />
              </View>
            )
          }}
          keyExtractor={(item, index) => index}
        />
        <Text style={{ fontSize: WP(3), marginBottom: WP(8) }}>Headcount: {children?.length}</Text>
      </ScrollView>

      <Modal
        visible={isVisible}
        onTouchOutside={() => {
          setVisible(false)
        }}
      >
        <ModalContent>
          <TouchableWithoutFeedback onPress={() => {
            dropDown1.current.close()
            dropDown2.current.close()
            dropDown3.current.close()
            dropDown4.current.close()
            dropDown5.current.close()
          }}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>

              <Text style={{ width: '100%', textAlign: 'center', marginBottom: 20 }}>Edit Time</Text>
              <View style={{ height: WP(20), flexDirection: 'row', zIndex: 2000 }}>
                <DropDownPicker
                  items={hours}
                  defaultValue={modalHour}
                  dropDownStyle={{ height: 10, backgroundColor: '#fafafa' }}
                  containerStyle={{ height: 40, width: WP(17) }}
                  style={{ backgroundColor: '#fafafa' }}
                  dropDownMaxHeight={WP(25)}
                  controller={(instance) => dropDown1.current = instance}
                  onOpen={() => {
                    dropDown2.current.close()
                    dropDown3.current.close()
                    dropDown4.current.close()
                    dropDown5.current.close()
                  }}
                  onChangeItem={item => {
                    setHour(item.value)
                  }}
                />

                <DropDownPicker
                  items={minutes()}
                  defaultValue={modalMinute}
                  containerStyle={{ height: 40, width: WP(17), marginLeft: 10 }}
                  style={{ backgroundColor: '#fafafa' }}
                  dropDownStyle={{ backgroundColor: '#fafafa' }}
                  dropDownMaxHeight={WP(25)}
                  setValue={modalMinute}
                  onOpen={() => {
                    dropDown1.current.close()
                    dropDown3.current.close()
                    dropDown4.current.close()
                    dropDown5.current.close()
                  }}
                  onChangeItem={item => {
                    setMinute(item.value)
                  }}
                  controller={(instance) => dropDown2.current = instance}
                />

                <DropDownPicker
                  items={minutes()}
                  defaultValue={modalSec}
                  containerStyle={{ height: 40, width: WP(17), marginLeft: 10 }}
                  style={{ backgroundColor: '#fafafa' }}
                  dropDownStyle={{ backgroundColor: '#fafafa' }}
                  dropDownMaxHeight={WP(25)}
                  onChangeItem={item => {
                    setSec(item.value)
                  }}
                  controller={(instance) => dropDown3.current = instance}
                  onOpen={() => {
                    dropDown1.current.close()
                    dropDown2.current.close()
                    dropDown4.current.close()
                    dropDown5.current.close()
                  }}
                />


                <DropDownPicker
                  items={AMPM}
                  defaultValue={modalAMPM}
                  containerStyle={{ height: 40, width: WP(18), marginLeft: 10 }}
                  style={{ backgroundColor: '#fafafa' }}
                  dropDownStyle={{ backgroundColor: '#fafafa' }}
                  dropDownMaxHeight={WP(25)}
                  controller={(instance) => dropDown4.current = instance}
                  onOpen={() => {
                    dropDown1.current.close()
                    dropDown2.current.close()
                    dropDown3.current.close()
                    dropDown5.current.close()
                  }}
                  onChangeItem={item => {
                    setAMPM(item.value)
                  }}
                />


                <DropDownPicker
                  items={type}
                  defaultValue={modalType}
                  containerStyle={{ height: 40, width: WP(18), marginLeft: 10 }}
                  style={{ backgroundColor: '#fafafa' }}
                  dropDownStyle={{ backgroundColor: '#fafafa' }}
                  dropDownMaxHeight={WP(25)}
                  onChangeItem={item => {
                    setType(item.value)
                  }}
                  controller={(instance) => dropDown5.current = instance}

                  onOpen={() => {
                    dropDown1.current.close()
                    dropDown3.current.close()
                    dropDown4.current.close()
                    dropDown2.current.close()
                  }}
                />
              </View>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => {
                  Alert.alert(
                    //This is title
                    'Delete Entry',
                    //This is body text
                    'Are you sure you want to delete this entry',
                    [
                      { text: 'No', onPress: () => { } },
                      { text: 'Yes', onPress: () => deleteEntry() },
                    ],
                    //on clicking out side, Alert will not dismiss
                  );
                }}
                  style={{ backgroundColor: 'red', borderWidth: 0.4, borderColor: '#000', paddingVertical: 10, paddingHorizontal: 20 }}>
                  <Text style={{ color: '#fff' }}>Delete</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { setVisible(false) }}
                  style={{ backgroundColor: 'yellow', borderWidth: 0.4, borderColor: '#000', paddingVertical: 10, paddingHorizontal: 20, marginHorizontal: 50 }}>
                  <Text>Cancel</Text>
                </TouchableOpacity>


                <TouchableOpacity onPress={() => updateEntry()}
                  style={{ backgroundColor: '#0aaae0', borderWidth: 0.4, borderColor: '#000', paddingVertical: 10, paddingHorizontal: 20 }}>
                  <Text style={{ color: '#fff' }}>Update</Text>
                </TouchableOpacity>
              </View>

            </View>
          </TouchableWithoutFeedback>
        </ModalContent>
      </Modal>
    </SafeAreaView>
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
    fontSize: WP(2)
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
    borderRadius: WP(5),
    height: WP(10),
    backgroundColor: 'black',
    borderColor: 'white',
    borderWidth: 2,
    padding: WP(2),
    alignItems: 'center',
    flexDirection: 'row'
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
  dropDownView1: {
    flexDirection: 'row',
    zIndex: 20,
    alignItems: 'center',
    marginBottom: WP(1),
    width: WP(35),
    justifyContent: 'space-between',
    zIndex: 3000
  },

  dropDownView2: {
    flexDirection: 'row',
    zIndex: 20,
    alignItems: 'center',
    marginBottom: WP(1),
    width: WP(35),
    justifyContent: 'space-between',
    zIndex: 2000
  },

  dropDownView3: {
    flexDirection: 'row',
    zIndex: 20,
    alignItems: 'center',
    marginBottom: WP(1),
    width: WP(35),
    justifyContent: 'space-between',
    zIndex: 1000
  },

  dropDownplaceholder: {
    fontSize: WP(2),
    marginLeft: WP(2),
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
    height: WP(8),
    width: WP(20),
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


  modalDropDown: {
    backgroundColor: '#fff',
    height: WP(4),
    marginBottom: 10
  },
});
export default Home;