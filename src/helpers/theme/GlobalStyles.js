import { StyleSheet } from 'react-native';
import { AppColor } from './Colors';
import { Typography } from './Typograghy';

export const GLOBAL_SHEET = StyleSheet.create({
    mainContainer: {
      flex:1,
      backgroundColor:AppColor.white,
      padding:Typography.wpOne
    },
    cardContainer:{
        marginBottom:Typography.wpFour,
        marginHorizontal:Typography.wpOne,
        padding:Typography.wpThree,
        borderRadius:Typography.wpTwo,
        shadowColor: "#000",
        shadowOffset: {
            width: 0.5,
            height: 0.5,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3.27,
        elevation: 10,
        backgroundColor: AppColor.white,
        justifyContent:'center',
        alignItems:'center'
    }
})