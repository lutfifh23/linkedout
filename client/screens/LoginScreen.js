import { gql, useMutation } from '@apollo/client';
import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Button, Alert } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import * as SecureStore from 'expo-secure-store'

const USER_LOGIN = gql`
mutation Login($user: UserLogin) {
  login(user: $user) {
    access_token
    userId
  }
}
`

const LoginScreen = ({ navigation }) => {
    const { setIsSignedIn, setUserId } = useContext(AuthContext)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [doLogin, { loading, error, data }] = useMutation(USER_LOGIN)

    const handleLogin = async () => {
        try {
            const result = await doLogin({
                variables: {
                    user: {
                        password: password,
                        username: username

                    }
                }
            })
            await SecureStore.setItemAsync(
                'access_token',
                result.data?.login?.access_token
            )
            console.log(result.data?.login?.userId, "<<<COBAA");
            await SecureStore.setItemAsync(
                'userId',
                result.data?.login?.userId
            )
            setUserId(result.data?.login?.userId)
            setIsSignedIn(true)
        } catch (error) {
            Alert.alert(error.message)
        }

    };

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/out.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <Text style={styles.title}>Linked Out</Text>
            <TextInput
                style={[styles.input, { color: '#F2613F' }]}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                placeholderTextColor='#F2613F'
            />
            <TextInput
                style={[styles.input, { color: '#F2613F' }]}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor='#F2613F'
            />
            <TouchableOpacity style={styles.button} onPress={() => handleLogin()}>
                <View>
                    <Text style={styles.buttonText}>
                        {loading ? 'loading...' : "Login"}
                    </Text>
                </View>
            </TouchableOpacity>
            <Text style={{ color: '#F2613F', marginTop: 10 }}>Or</Text>
            <Text style={{ color: '#F2613F', marginTop: 10 }}>Don't have an account? <Text onPress={() => navigation.navigate('Register')} style={{ color: 'orange' }}>Register</Text></Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0C0C0C',
        paddingHorizontal: 20,
    },
    logo: {
        width: 100,
        height: 150,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        color: '#F2613F',
        fontWeight: 'bold'
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#F2613F',
        width: '100%',
        height: 40,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#0C0C0C',
        fontSize: 18,
    },
});

export default LoginScreen;
