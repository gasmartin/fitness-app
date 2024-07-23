import AsyncStorage from "@react-native-async-storage/async-storage";

export const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem("access_token");
        return token;
    }
    catch (error) {
        console.error('Failed to retrieve token from storage', error);
        return null;
    }
}

export const setToken = async (token) => {
    try {
        await AsyncStorage.setItem("access_token", token);
    }
    catch (error) {
        console.error('Failed to store token in storage', error);
    }
}

export const removeToken = async () => {
    try {
        await AsyncStorage.removeItem("access_token");
    }
    catch (error) {
        console.error('Failed to remove token from storage', error);
    }
}