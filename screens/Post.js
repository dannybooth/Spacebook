import React, { Component } from 'react';
import {
  StyleSheet, View, Text, Button, FlatList, Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      user: null,
	  post: [],
      postError: '',
	  post_id: '',
	  user_id: '',
    };
  }

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener('focus', () => {
      this.checkLoggedIn();
	  const { post_id } = this.props.route.params;
	  const { user_id } = this.props.route.params;
      this.getuser(user_id);
      this.searchpost(post_id,user_id);
      this.setState({ friendError: '' });
      this.setState({ postError: '' });
    });
	const { post_id } = this.props.route.params;

    this.getuser(user_id);
    this.searchpost(post_id);
	const { user_id } = this.props.route.params;
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getuser = async (valueid) => {
    // Validation here...
    const value = await AsyncStorage.getItem('@session_token');

    return fetch(`http://localhost:3333/api/1.0.0/user/${valueid}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': value,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 400) {
          throw 'Failed validation';
        } else {
          throw 'Something went wrong';
        }
      })
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          user: responseJson,
		  user_id: valueid,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  searchpost = async (post_id, valueid) => {
    // Validation here...
    const value = await AsyncStorage.getItem('@session_token');

    return fetch(`http://localhost:3333/api/1.0.0/user/${valueid}/post/${post_id}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': value,
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } if (response.status === 400) {
          this.setState({ error: 'Failed validation' });
          throw this.state.error;
        } else if (response.status === 401) {
          this.setState({ error: 'Failed Unauthorised' });
          throw this.state.error;
        } else if (response.status === 403) {
          this.setState({ error: 'Can only view yourself and friends' });
          throw this.state.error;
        } else if (response.status === 404) {
          this.setState({ error: 'Not Found' });
          throw this.state.error;
        } else if (response.status === 500) {
          this.setState({ error: 'Server Error' });
          throw this.state.error;
        } else {
          this.setState({ error: 'Something went wrong' });
          throw this.state.error;
        }
      })
      .then((responseJson) => {
        this.setState({
          post: responseJson,
		  post_id: post_id,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  likepost = async (postid, valueid) => {
    // Validation here...
    const value = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/user/${valueid}/post/${postid}/like`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': value,
      },
    })
      .then((response) => {
        if (response.status === 200) {
        } else if (response.status === 400) {
          this.unlikepost(postid, valueid);
          throw 'Failed validation';
        } else if (response.status === 401) {
          throw 'Unauthorised';
        } else if (response.status === 403) {
          this.unlikepost(postid, valueid);
          throw 'You have already liked this post';
        } else if (response.status === 404) {
          throw 'post not found';
        } else if (response.status === 500) {
          throw 'Server error';
        } else {
          throw 'Something went wrong';
        }
      })
      .then(() => {
        this.searchpost(postid, valueid);
        console.log('Liked posted with ID: ', postid);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  


  unlikepost = async (postid, valueid) => {
    // Validation here...
    const value = await AsyncStorage.getItem('@session_token');
    return fetch(`http://localhost:3333/api/1.0.0/user/${valueid}/post/${postid}/like`, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': value,
      },
    })
      .then((response) => {
        if (response.status === 200) {
        } else if (response.status === 400) {
          throw 'Failed validation';
        } else if (response.status === 401) {
          throw 'Unauthorised';
        } else if (response.status === 403) {
          throw 'You have not liked this post';
        } else if (response.status === 404) {
          throw 'post not found';
        } else if (response.status === 500) {
          throw 'Server error';
        } else {
          throw 'Something went wrong';
        }
      })
      .then(() => {
        this.searchpost(postid, valueid);
        console.log('Unliked posted with ID: ', postid);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  
  

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      this.props.navigation.navigate('Login');
    }
  };

  checkLoggedIn = async () => {
    const value = await AsyncStorage.getItem('@session_token');
    if (value == null) {
      this.props.navigation.navigate('Login');
    }
  };

  render() {
    if (this.state.isLoading) {
      return (<View><Text>Loading...</Text></View>);
    }
    return (
      <View style={styles.container}>
	  <Button
          title="Back"
          onPress={() => this.props.navigation.goBack()}
        />
        <Text>
          {this.state.postError}
          {' '}
        </Text>
		<Button
                title="Like"
                onPress={() => this.likepost(this.state.post_id, this.state.user_id)}
              />
        <Text>
                {this.state.post.text}
                {' '}
                {'\n'}
              </Text>
			  <Text>
			  {'\n'}
                Likes:
                {this.state.post.numLikes}
              </Text>
              <Text>{this.state.post.timestamp}</Text>
      </View>
    );
  }
}

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'left',
    justifyContent: 'center',
  },
});
