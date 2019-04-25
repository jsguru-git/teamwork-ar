import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Content, Item, Input, Icon, Container, Header } from "native-base";

type Props = {
    value: string,
    onChange(text: string): void,
}

const Searchbar = (props: Props) => (
        <Header searchBar rounded style={styles.header} androidStatusBarColor='#2E2f39'>
            <Item style={styles.bar}>
                <Icon name="ios-search" />
                <Input placeholder="Search" value={props.value} onChangeText={(text) => props.onChange(text)} />
                {/* <Icon name="ios-people" /> */}
            </Item>
        </Header>
)

export default Searchbar;

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#2E2f39',
        shadowOpacity: 0,
        shadowRadius: 0,
        shadowOffset: {
            height: 0,
            width: 0,
        }
    },
    bar: {
        backgroundColor: '#fff'
    }
})