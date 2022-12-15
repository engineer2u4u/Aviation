import React from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Modal,
  Text,
  View,
} from 'react-native';

const {width} = Dimensions.get('window');
export default function Loader({visible, subtext}) {
  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.3)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator visible={visible} color="#54D9D5" size={100} />
        {subtext !== '' && (
          <Text style={{color: 'white', fontSize: width / 17}}>{subtext}</Text>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({});
