import { StyleSheet, View, Text } from 'react-native';
import Slider from '@react-native-community/slider';

const ZhangSlider = ({ label, value, onValueChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}: {value}/5</Text>
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={5}
        step={1}
        value={value}
        onValueChange={onValueChange}
        minimumTrackTintColor="#4CAF50" 
        maximumTrackTintColor="#6200EE"
        thumbTintColor="#6200EE" 
      />
      <View style={styles.scaleLabels}>
        <Text style={styles.scaleText}>1 (Low)</Text>
        <Text style={styles.scaleText}>5 (High)</Text>
      </View>
    </View>
  );
};

export default ZhangSlider;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: -4,
  },
  scaleText: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
});