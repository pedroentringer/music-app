import AppIndex from "./src/AppIndex";

import ThemeProvider from './src/providers/theme';
import PlayerProvider from './src/providers/player';

import 'react-native-gesture-handler';

export default function App() {    
      
  return (
      <ThemeProvider>
          <PlayerProvider>
            <AppIndex />
          </PlayerProvider>
      </ThemeProvider>
  );

}