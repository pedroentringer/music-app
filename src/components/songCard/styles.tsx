import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from '@expo/vector-icons';

export const IconLiked = styled(MaterialIcons).attrs((props) => ({
    name: 'favorite',
    size: 24,
    color: '#EF3A69'
}))``;

export const IconNotLiked = styled(MaterialIcons).attrs((props) => ({
    name: 'favorite-border',
    size: 24,
    color: '#132B4A'
}))``;

export const IconPause = styled(MaterialIcons).attrs((props) => ({
    name: 'pause',
    size: 28,
    color: props.theme.colors.gradient.text
}))``;

export const IconPlay = styled(MaterialIcons).attrs((props) => ({
    name: 'play-arrow',
    size: 28,
    color: props.theme.colors.gradient.text
}))``;

export const SongImageContainer = styled.View`
    position: relative;
    width: 60px;
    height: 60px;
    border-radius: 8px;
`;

export const SongImage = styled.Image`
    position: absolute;
    top: 0px;
    left: 0px;
    width: 60px;
    height: 60px;
    border-radius: 8px;
`;

export const SongImageGradient = styled(LinearGradient).attrs(props => ({
    colors: [
        props.theme.colors.gradient.start, 
        props.theme.colors.gradient.end
    ]
}))`
    position: absolute;
    top: 0px;
    left: 0px;
    width: 60px;
    height: 60px;
    border-radius: 8px;
    align-items: center;
    justify-content: center;
    opacity: 0.7;
`;

export const Container = styled.TouchableOpacity.attrs((props) => ({
    activeOpacity: 0.7
}))`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0px;
`;

export const SongInfo = styled.View`
    flex: 1;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    align-self: stretch;
    margin-left: 16px;
`;