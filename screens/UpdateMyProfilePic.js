import React, { Component } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, Button,
} from 'react-native';
import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasPermission: null,
      type: Camera.Constants.Type.back,
      error: '',
    };
  }

  async componentDidMount() {
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({ hasPermission: status === 'granted' });
  }

  sendToServer = async (data) => {
    // Get these from AsyncStorage
    const valueid = await AsyncStorage.getItem('@id');
    const value = await AsyncStorage.getItem('@session_token');

    const res = await fetch(data.base64);
    const blob = await res.blob();

    return fetch(`http://localhost:3333/api/1.0.0/user/${valueid}/photo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'image/png',
        'X-Authorization': value,
      },
      body: blob,
    })
      .then((response) => {
        if (response.status === 200) {
          console.log('Picture added', response);
        } else if (response.status === 400) {
          this.setState({ error: 'Failed validation' });
          throw this.state.error;
        } else if (response.status === 401) {
          this.setState({ error: 'Unauthorised' });
          throw this.state.error;
        } else if (response.status === 404) {
          this.setState({ error: 'Not Found' });
          throw this.state.error;
        } else {
          this.setState({ error: 'Something went wrong' });
          throw this.state.error;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  takePicture = async () => {
    if (this.camera) {
      const options = {
        quality: 0.5,
        base64: true,
        onPictureSaved: (data) => this.sendToServer(data),
      };
      await this.camera.takePictureAsync(options);
    }
  };

  render() {
    if (this.state.hasPermission) {
      return (
        <>
          <Text>
            {this.state.error}
            {' '}
          </Text>
          <View style={styles.container}>
            <Button
              title="Back"
              onPress={() => this.props.navigation.goBack()}
            />
            <Camera
              style={styles.camera}
              type={this.state.type}
              ref={(ref) => this.camera = ref}
            >
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    this.takePicture();
                  }}
                >
                  <Text style={styles.text}> Take Photo </Text>
                </TouchableOpacity>
              </View>
            </Camera>
          </View>

        </>
      );
    }
    return (
      <Text>No access to camera</Text>
    );
  }
}

export default App;
