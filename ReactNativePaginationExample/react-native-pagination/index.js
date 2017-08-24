
/**
   * @author garrettmac <garrett@vyga.io> (http://vyga.io)
   * @version 1.0.4
   * @module ReactNativePagination (https://github.com/garrettmac/react-native-pagination)
 */


import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  LayoutAnimation,
  Dimensions,TouchableOpacity,
} from 'react-native';
import _ from 'lodash';
_.mixin({compactObject: (o)=> {return _.each(o, (v, k)=> {if(!v) delete o[k];});}});

import Icon from './components/Icon';
import Dot from './components/Dot';
const {width, height} = Dimensions.get('window');

import PropTypes from 'prop-types';

//helper functions

let showLogs=true;
var CustomLayoutSpring = {
    duration: 400,
    create: {
      type: LayoutAnimation.Types.spring,
      property: LayoutAnimation.Properties.scaleXY,
      springDamping: 0.7,
    },
    update: {
      type: LayoutAnimation.Types.spring,
      springDamping: 0.7,
    },
  };

// export default class Pagination extends Component {
class Pagination extends Component {
  // state={dots:[]}
  dots=[]
  // componentWillUpdate(this.props, nextState) {
  // componentWillReceiveProps(nextProps) {
// console.log(" nextProps: ",nextProps.paginationVisibleItems);
render(){


    let {
      iconFamily,
      textStyle,
      containerStyle,
      nextButtonStyle,
      backButtonStyle,
      backwardStyle,
      dotStyle,
      backText,
      backStyle,
      nextText,
      nextStyle,
      paginationItemPadSize,

    paginationItems,
    horizontal,
    startDotStyle,
    endDotStyle,
    debugMode,
    dotAnimation,
    paginationStyle,
    pagingEnabled,
    renderDot,
     onPressPaginationDot,
    // showStartingJumpDot,showEndingJumpDot,endingJumpSize,startingJumpSize,
paginationDot,
    hideEmptyDots,
    } = this.props
    // } = this.props
    // const Dot = this.props.paginationDot || Dot
    let paginationDotCallback=this.props.paginationDotCallback||function(){}
    let startDotCallback=this.props.startDotCallback||function(){}
    let endDotCallback=this.props.endDotCallback||function(){}
if(showLogs)console.log(" this.props: ",this.props);

    const startPaginationDot=this.props.startPaginationDot||Dot
    const startJumpPaginationDot=this.props.startJumpPaginationDot||Dot
    const endPaginationDot=this.props.endPaginationDot||Dot
    const viewablePaginationDot=this.props.viewablePaginationDot||Dot

paginationItems=paginationItems.map((item,i) => {
  item.paginationIndexId=i
  item.index=i
  item.paginationHasSeenItem=false
  item.paginationHasPressedItem=false
  item.paginationSelectedItem=false
  return item
})
// paginationVisibleItemsIndexList this list of index that you want to remove or you'll see two active icon buttons
let paginationVisibleItemsIndexList=[]
let paginationVisibleItems=[]
 if(pagingEnabled){
   console.log("PRPL NEXT: ",this.props.paginationVisibleItems);
   console.log("PRPL this: ",this.props.paginationVisibleItems);
   if(this.props.paginationVisibleItems.length==2)paginationVisibleItems=this.props.paginationVisibleItems
   else if(this.props.paginationVisibleItems.length==2)paginationVisibleItems=this.props.paginationVisibleItems
// if(!paginationVisibleItems)paginationVisibleItems=this.props.paginationVisibleItems
if(!paginationVisibleItems.length)paginationVisibleItems=this.props.paginationVisibleItems
 }else{
paginationVisibleItems=this.props.paginationVisibleItems
 }
 if(pagingEnabled){
     let indexMap=paginationVisibleItems.map(i=>i.index)
   //fix issue where it says two visable list items are active when only one should be
   if(indexMap.length>1){
   paginationVisibleItems=paginationVisibleItems.map((o) => {
     if(o.index===_.max(indexMap)){return {index:_.get(o,`index`),key:_.get(o,`key`),item:_.get(o,`item`,{}),isViewable:false}}
     else return o
   })
  }
  paginationVisibleItemsIndexList=paginationVisibleItems
}else{

  paginationVisibleItemsIndexList=paginationVisibleItems.map(i=>i.index)
}
if(paginationVisibleItems.length)paginationVisibleItemsIndexList=paginationVisibleItems.map(i=>i.index)

console.log(" this.props.paginationVisibleItems: ",this.props.paginationVisibleItems);
console.log(" this.props.paginationVisibleItems: ",this.props.paginationVisibleItems);
console.log(" paginationVisibleItems: ",paginationVisibleItems);
 //gets max and min pads. should look something like [0, -1, -2, 2, 3, 4] if [0,1] are viewable and paginationItemPadSize is 3
const getVisibleArrayIndexes= (paginationVisibleItems,paginationVisibleItemsIndexList, paginationItemPadSize)=>{
 let preIniquePaddedIndexList=[..._.times(paginationItemPadSize,i=>_.min(paginationVisibleItemsIndexList)-(i+1)),..._.times(paginationItemPadSize,i=>_.max(paginationVisibleItemsIndexList)+(i+1))]
 let uniquePaddedIndexList= preIniquePaddedIndexList.map((num,i) => {
    if(num < 0)return _.max(paginationVisibleItemsIndexList)+(num*= -1)
    else return num
   });
   return _.uniq(uniquePaddedIndexList)
 }


 let paginationVisableItemsIndexArray=getVisibleArrayIndexes(paginationVisibleItems,paginationVisibleItemsIndexList,paginationItemPadSize)

console.log(" paginationVisibleItems: ",paginationVisibleItems);
let paginationVisiblePadItems= paginationVisableItemsIndexArray.map((o,i) => {
   return {index:_.get(paginationItems,`[${o}].paginationIndexId`),key:_.get(paginationItems,`[${o}].paginationIndexId`),item:_.get(paginationItems,`[${o}]`,{}),isViewable:false}
})



 let flatListPaginationItems=_.sortBy([...paginationVisibleItems,...paginationVisiblePadItems],"index")
if(showLogs)console.log("flatListPaginationItems : ",flatListPaginationItems);
if(debugMode){
  let paginationItemsIndexList=paginationItems.map(i=>i.index)
  let allDotsIndexList=flatListPaginationItems.map(i=>i.index)
  let NOT_ACTIVE_DOTS_INDEXES=_.sortBy(paginationVisiblePadItems.map(i=>i.index))
  let ALL_DOTS_INDEXES=flatListPaginationItems.map(i=>i.isViewable)
  let ___=`%c __________________________________________\n`
  let ADBY=`%c all paginationVisibleItems dots:              ${allDotsIndexList} \n`
  let ADI=`%c active paginationVisibleItems dots:           ${paginationVisibleItemsIndexList} \n`
  let ANDI=`%c not active dots: (padding):    ${NOT_ACTIVE_DOTS_INDEXES} \n`

  let ADI_ISVIEWABLE=`%c each "paginationVisibleItems dots" "isViewable" attribute:\n                      ${ALL_DOTS_INDEXES} \n`
  let AID=`%c all "paginationItems"'s':       ${paginationItemsIndexList} \n`
  if(showLogs)console.log('\n\n%cGarrett Mac\'s React Native Pagination'+"%c \ndebugMode: ON\n"+___+ADBY+ADI+ANDI+___+ADI_ISVIEWABLE+___+AID, 'color: #01a699','color: #f99137','color: #f99137','color: #a94920','color: #00a7f8','color: #3b539a','color: #32db64','color: #00c59e','color: #3b539a','color: #488aff');
}




// let dots=[]
console.log(" flatListPaginationItems: ",flatListPaginationItems);
// flatListPaginationItems.map((item,i) => {
// // paginationVisibleItems.map((item,i) => {
//     // LayoutAnimation.configureNext(dotAnimation);
//     // LayoutAnimation.configureNext(CustomLayoutSpring);
//
// return renderDot(item,i)
// // let dot=React.Children.map(renderDot(item,i), child =>  React.cloneElement(child, {  horizontal}))
// // return React.Children.map(renderDot(item,i), child =>  React.cloneElement(child, { key:`asdfsdf${i}`, horizontal}))
// // dots.concat(dot)
// // dots.push(dot)
// // let dots=renderDot(item,i)
// })

// console.log(" dots: ",dots);
// this.setState({dots})
// this.dots=flatListPaginationItems
// this.setState({dots:flatListPaginationItems})
// }
/*flatListPaginationItems.map((item,i) => {

})
paginationItems.map((item,key) => {
  return renderDot(item,i)
})

const childrenWithProps = React.Children.map(this.props.children,
    (child) => React.cloneElement(child, {
      doSomething: this.doSomething
    })
   );

   return <div>{childrenWithProps}</div>*/
// render() {
// let {style,horizontal,renderDot,dotAnimation}=this.props
// let {dots}=this.state
  let horizontalStyle={width,alignItems:"center", justifyContent: 'space-between', position:"absolute",margin:0,bottom:10,left:0,right:0,padding:0,flex:1,}
let dots=[]
dots=this.dots

  if(horizontal===true)style=horizontalStyle
  else if(paginationStyle)style=paginationStyle


    return (
      <View style={[style]}>
        <View style={[{
          flex: 1,
          marginTop:(horizontal===true)?0:20,
          marginBottom:(horizontal===true)?0:20,
          marginLeft:(horizontal===true)?5:0,
          marginRight:(horizontal===true)?5:0,
          width:(horizontal===true)?width:40,
          height:(horizontal===false)?height:30,
      flexDirection: (horizontal==true)?"row":"column",
      justifyContent: 'center',alignItems:"center"},]}>



{/* {dots} */}
{/* {dots.map((item,i) => {
  // item.isViewable=!item.isViewable
  // LayoutAnimation.configureNext(CustomLayoutSpring);
  LayoutAnimation.configureNext(dotAnimation);
return React.Children.map(renderDot(item,i), child =>  React.cloneElement(child, { key:`asdfsdf${i}`, horizontal}))

})} */}
{flatListPaginationItems.map((item,i) => {


LayoutAnimation.configureNext(dotAnimation)
    return (<View style={{flex:1}} key={i}>
       {React.Children.map(renderDot(item,i), child =>  React.cloneElement(child, { key:`asdfsdf${i}`, horizontal}))}

          </View>)
  })}
</View>
</View>
    );



  }
}



const s = StyleSheet.create({
  container: {

  },
});

Pagination.defaultProps={

// containerStyle:{flex: 1,backgroundColor:"red",width,height:null},
containerStyle:null,
// textStyle:{color:"rgba(0,0,0,0.5)",textAlign: "center",},
style:{height,alignItems:"center", justifyContent: 'space-between', position:"absolute",top:0,margin:0,bottom:0,right:0,bottom:0,padding:0,flex:1,},

paginationVisibleItems:[],
paginationItems:[],
horizontal             : false,
pageRangeDisplayed    : 10,
hideEmptyDots:false,
activeItemIndex:null,
hideEmptyDotComponents:false,
paginationItemPadSize:3,
// dotAnimation:LayoutAnimation.Presets.easeInEaseOut,
dotAnimation:LayoutAnimation.Presets.spring,
}
//NOT WORKING (I dont know why)
Pagination.PropTypes={
  paginationItems:PropTypes.array,
  visableItemList:PropTypes.array,
}
export default Pagination
export {Icon,Dot}