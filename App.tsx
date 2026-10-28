import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootStackParamList } from './src/types';
import BookListScreen from './src/screens/BookListScreen';
import BookFormScreen from './src/screens/BookFormScreen';
import BookDetailScreen from './src/screens/BookDetailScreen';
import { Colors, Fonts } from './src/theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Ứng dụng Quản lý Thư viện
 * React Native CLI
 */
const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="BookList"
          screenOptions={{
            headerStyle: {
              backgroundColor: Colors.primary,
            },
            headerTintColor: Colors.white,
            headerTitleStyle: {
              fontWeight: '600',
              fontSize: 18,
            },
            headerShadowVisible: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen
            name="BookList"
            component={BookListScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="BookForm"
            component={BookFormScreen}
            options={({ route }) => ({
              title: route.params?.book ? 'Sửa sách' : 'Thêm sách mới',
            })}
          />
          <Stack.Screen
            name="BookDetail"
            component={BookDetailScreen}
            options={{
              title: 'Chi tiết sách',
              headerStyle: {
                backgroundColor: Colors.primary,
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
