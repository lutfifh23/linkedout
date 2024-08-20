import { gql, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const POST_POSTS = gql`
mutation AddPost($content: String, $tags: [String], $imgUrl: String) {
  addPost(content: $content, tags: $tags, imgUrl: $imgUrl)
}
`

const PostScreen = ({ navigation }) => {
    const [content, setContent] = useState('');
    const [imgUrl, setImgUrl] = useState('');
    const [tags, setTags] = useState('');
    const [doPosts, { data, loading, error, refetch }] = useMutation(POST_POSTS)
    console.log({ data, loading, error }, "<<<CEKKK");

    const handlePost = async () => {
        try {
            const result = await doPosts({
                variables: {
                    content: content,
                    tags: tags,
                    imgUrl: imgUrl
                }
            })
            console.log(result, "<<<RESULTT");
            const tagsArray = tags.split(',').map(tag => tag.trim());

            console.log('Posting...', { content, imgUrl, tags: tagsArray });

            setContent('');
            setImgUrl('');
            setTags('');

            navigation.navigate('Home');

            Alert.alert('Post Successful', 'Your post has been successfully posted!');
        } catch (error) {
            Alert.alert('Error', 'Content is required')
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create a Post</Text>
            <TextInput
                style={styles.input}
                placeholder="What's on your mind?"
                value={content}
                onChangeText={setContent}
                multiline
                numberOfLines={4}
            />
            <TextInput
                style={styles.input}
                placeholder="Image URL (optional)"
                value={imgUrl}
                onChangeText={setImgUrl}
            />
            <TextInput
                style={styles.input}
                placeholder="Tags (comma-separated)"
                value={tags}
                onChangeText={setTags}
            />
            <TouchableOpacity style={styles.button} onPress={handlePost}>
                <Text style={styles.buttonText}>Post</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        fontSize: 16,
        minHeight: 50, // Minimum height for multiline input
    },
    button: {
        backgroundColor: '#F2613F',
        width: '100%',
        height: 40,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
    },
});

export default PostScreen;
