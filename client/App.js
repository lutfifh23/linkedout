import * as React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store'
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import PostScreen from './screens/PostScreen';
import ProfileScreen from './screens/ProfileScreen';
import PostDetailScreen from './screens/PostDetail';
import SearchScreen from './screens/SearchScreen';
import { ApolloProvider } from '@apollo/client';
import client from './configs/apollo';
import { AuthContext } from './contexts/AuthContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen}
        options={{
          unmountOnBlur: true,
          headerShown: false, tabBarIcon: ({ focused }) => {
            if (focused) {
              return <Ionicons name="home-sharp" size={24} color="black" />
            } else {
              return <Ionicons name="home-outline" size={24} color="black" />
            }
          }
        }} />
      <Tab.Screen name="Posts" component={PostScreen} options={{
        headerShown: false, tabBarIcon: ({ focused }) => {
          if (focused) {
            return <Ionicons name="add-circle-sharp" size={24} color="black" />
          } else {
            return <Ionicons name="add-circle-outline" size={24} color="black" />
          }
        }
      }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{
        headerShown: false, tabBarIcon: ({ focused }) => {
          if (focused) {
            return <FontAwesome name="user-circle" size={24} color="black" />
          } else {
            return <FontAwesome name="user-circle-o" size={24} color="black" />
          }
        }
      }} />
    </Tab.Navigator>
  );
}

function App() {
  const [userId, setUserId] = useState('')
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    async function checkToken() {
      const result = await SecureStore.getItemAsync('access_token')
      const user = await SecureStore.getItemAsync('userId')
      if (result) setIsSignedIn(true)
      if (user) setUserId(user)
      setLoading(false)
    }
    checkToken()
  }, [])
  if (loading) return <></>
  return (
    <ApolloProvider client={client}>
      <AuthContext.Provider value={{ isSignedIn, setIsSignedIn, userId, setUserId }}>
        <NavigationContainer>
          <StatusBar />
          <Stack.Navigator initialRouteName="Login">
            {isSignedIn ? (
              <>
                <Stack.Screen name='X' component={MyTabs} options={{ headerShown: false }} />
                <Stack.Screen name="PostDetail" component={PostDetailScreen} />
                <Stack.Screen name="Search" component={SearchScreen} />
              </>) : (
              <>
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
              </>
            )}

          </Stack.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>
    </ApolloProvider>
  );
}

export default App;