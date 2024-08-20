import { gql, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';

const USER_REGISTER = gql`
mutation Register($user: NewUser) {
  register(user: $user) {
    _id
    name
    username
    email
    password
    follower {
      _id
      followingId
      followerId
      createdAt
      updatedAt
    }
    followerDetail {
      _id
      name
      username
    }
    following {
      _id
      followingId
      followerId
      createdAt
      updatedAt
    }
    followingDetail {
      _id
      name
      username
    }
  }
}
`

const RegisterScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [doRegister] = useMutation(USER_REGISTER)

    const handleRegister = async () => {
        try {
            const result = await doRegister({
                variables: {
                    user: {
                        username: username,
                        name: name,
                        email, email,
                        password, password
                    }
                }
            })
            navigation.navigate('Login')
            console.log(result, "<<<RESULTT");
        } catch (error) {
            Alert.alert(error.message)
            console.log(error.message)
        }

        console.log('Registering...', { username, name, email, password });
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
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                placeholderTextColor='#F2613F'
            />
            <TextInput
                style={[styles.input, { color: '#F2613F' }]}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
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
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            <Text style={{ color: '#F2613F', marginTop: 10 }}>Or</Text>
            <Text style={{ color: '#F2613F', marginTop: 10 }}>Already have an account? <Text onPress={() => navigation.navigate('Login')} style={{ color: 'orange' }}>Login</Text></Text>
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

export default RegisterScreen;