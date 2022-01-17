import AppIndex from "./src/AppIndex";

import ThemeProvider from './src/providers/theme';
import PlayerProvider from './src/providers/player';

import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';

import 'react-native-gesture-handler';

export default function App() {
    let [fontsLoaded] = useFonts({
        'Belgacon-Regular': require('./src/fonts/belgacom-regular.ttf'),
        'Belgacon-Bold': require('./src/fonts/belgacom-bold.ttf'),
        'Belgacon-UltraLight': require('./src/fonts/belgacom-ultralight.ttf'),
    });
    
      if (!fontsLoaded) {
        return <AppLoading />;
      } else {
        return (
            <ThemeProvider>
                <PlayerProvider>
                  <AppIndex />
                </PlayerProvider>
            </ThemeProvider>
        );
      }
}