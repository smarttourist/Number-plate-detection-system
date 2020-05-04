

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableHighlight,
} from 'react-native';

import {RNCamera} from 'react-native-camera'

import RNFetchBlob from 'react-native-fetch-blob'

const serverUrl='http://192.168.1.8:5000/send';



export default class App extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      path: null,
      input:{},
      messages:[],
      result:'',
      received:false,
      sent:false,
      number:{},
      
     
    };
  }

  render() { 
    return (
      
      <View style={styles.container}>  
        {this.state.path ? this.viewImage() : this.liveCam()} 
      </View>
    );
  }

  liveCam(){
    return(
     
      <RNCamera
          ref={(cam) => {
            this.RNCamera = cam
          }}
          style={styles.camview}
          >
        <TouchableHighlight
            style={styles.capture} 
            onPress={this.takePicture.bind(this)}
            underlayColor="rgba(255, 255, 255, 0.5)"
            >
          <View />
          </TouchableHighlight>            
        </RNCamera>
    )
  }


  viewImage(){
    const{received,messages}=this.state;
    //console.log(this.state.path);
    const fileURL = this.state.path;
    const cleanURL = fileURL.replace("file://", "");
    
    const upload = new FormData();

    upload.append('upload', {uri:fileURL, name: 'image', type: 'image/jpg'});
   // console.log(upload)
    if(!this.state.sent){
  
      RNFetchBlob.fetch('POST', serverUrl, {
      },[
        { name : 'upload', filename : 'image.jpg', type:'image/foo',data:RNFetchBlob.wrap(fileURL)},
      ]).then((response)=>{
        this.setState({sent:true});
        //this.setState()
        
        //messages.push(response.data);
        
        messages.push(response.data);
        console.warn(response.data);

      })
      .catch((err)=>console.log(err));

    }
    
    return(
      <View>
        <Image
        source={{uri:this.state.path}}
        style={styles.preview}/>
        <Text 
        style={styles.login}>
        status :{received}
        </Text>
       
        <Text
        style={styles.cancel}
        onPress={() =>{
          this.setState({path: null});
          this.setState({sent:false});  

        }}
        >Back
        </Text>

      </View>
    );

  }
  takePicture() {
    const options = {base64:true}

    this.RNCamera.takePictureAsync  ({metadata: options}).then((data) => {
      //console.log(data);
      this.setState({path:data.uri})
    }).catch((error) => {
      console.log(error)
    })
  }
}

const styles = StyleSheet.create({
  logS: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    
  },
  camview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,

  },
  capture: {
    
   width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
    borderColor: '#FFF',
    marginBottom: 15,
  },
  preview:{
    flex:1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
  cancel: {
    position: 'absolute',
    right: 20,
    top: 20,
    backgroundColor: 'transparent',
    color: '#FFF',
    fontWeight: '600',
    fontSize: 17,
  },
  login: {
    position: 'absolute',
    left: 20,
    top: 20,
    backgroundColor: 'transparent',
    color: '#FFF',
    fontWeight: '600',
    fontSize: 17,
  },
});