import Reactotron from "reactotron-react-native"

Reactotron
    .configure({host: '192.168.178.40', port: 9090})
    .useReactNative()
    .connect()