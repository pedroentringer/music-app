import styled from "styled-components/native";
import { SafeAreaView } from 'react-native';

import { MotiView } from 'moti'

export const Container = styled(MotiView)`
    width: 100%;
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
    background-color: ${(props) => props.theme.colors.secondary};
    padding: 0px 24px 24px 24px;
    elevation: 1;
    shadow-opacity: 1;
    shadow-radius: 5px;
    shadow-color: ${(props) => props.theme.colors.gray[200]};
    shadow-offset: 0px 0px;

    flex-direction: column;
    justify-content: center;
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

export const SongImage = styled.Image`
    width: 200px;
    height: 200px;
    border-radius: 100px;
`;

export const SafeArea = styled(SafeAreaView)`
    background-color: ${(props) => props.theme.colors.secondary};
`;