import styled from "styled-components/native";

import Animated from "react-native-reanimated";

export const ContainerMasterBackground = styled(Animated.View)`
    position: absolute;
    top; 0;
    left: 0;
    z-index: 6;
    background-color: ${({theme}) => theme.colors.gray[900]}
    opacity: 0;
    width: 100%;
    height: 100%;
`;

export const Container = styled(Animated.View)`
    position: absolute;
    top; 0;
    left: 0;
    z-index: 7;
    width: 100%;
    height: 100%;
    

    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
    background-color: ${(props) => props.theme.colors.secondary};
    padding: 0px 24px 24px 24px;
    elevation: 1;
    shadow-opacity: 1;
    shadow-radius: 5px;
    shadow-color: ${(props) => props.theme.colors.gray[900]}1c;
    shadow-offset: 0px 0px;

    flex-direction: column;
    justify-content: flex-start;
`;

export const MiniBar = styled.View`
    width: 50px;
    height: 5px;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.colors.gray[500]}ac;
    margin: 15px 0px 15px 0px
`;

export const ControllsContainer = styled.View`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
`;