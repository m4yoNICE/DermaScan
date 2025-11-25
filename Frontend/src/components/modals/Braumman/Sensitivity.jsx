import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Checkbox from "expo-checkbox";
import React, { useEffect, useState } from "react";

const Sensitivity = ({ onChange }) => {
  const [one, setOne] = useState(false);
  const [two, setTwo] = useState(false);
  const [three, setThree] = useState(false);
  const [four, setFour] = useState(false);
  const [five, setFive] = useState(false);

  useEffect(() => {
    const sensCount = [one, two, three].filter(Boolean).length;
    const resistCount = [four, five].filter(Boolean).length;

    if (sensCount > resistCount) onChange("sensitive");
    else if (resistCount >= sensCount) onChange("resistant");
  }, [one, two, three, four, five]);

  return (
    <View>
      <Text style={styles.subtitle}>
        Section 2: Sensitivity (Sensitive vs Resistant)
      </Text>

      <TouchableOpacity
        style={styles.section}
        onPress={() => setOne(!one)}
        activeOpacity={0.7}
      >
        <Checkbox style={styles.checkbox} value={one} onValueChange={setOne} />
        <Text style={[styles.paragraph, { flex: 1 }]}>
          My skin turns red or burns easily when using new products.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.section}
        onPress={() => setTwo(!two)}
        activeOpacity={0.7}
      >
        <Checkbox style={styles.checkbox} value={two} onValueChange={setTwo} />
        <Text style={[styles.paragraph, { flex: 1 }]}>
          I often feel stinging or itching after applying creams or soaps.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.section}
        onPress={() => setThree(!three)}
        activeOpacity={0.7}
      >
        <Checkbox
          style={styles.checkbox}
          value={three}
          onValueChange={setThree}
        />
        <Text style={[styles.paragraph, { flex: 1 }]}>
          My skin reacts to weather changes or stress.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.section}
        onPress={() => setFour(!four)}
        activeOpacity={0.7}
      >
        <Checkbox
          style={styles.checkbox}
          value={four}
          onValueChange={setFour}
        />
        <Text style={[styles.paragraph, { flex: 1 }]}>
          I rarely have irritation, even with scented or strong products.
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.section}
        onPress={() => setFive(!five)}
        activeOpacity={0.7}
      >
        <Checkbox
          style={styles.checkbox}
          value={five}
          onValueChange={setFive}
        />
        <Text style={[styles.paragraph, { flex: 1 }]}>
          My skin feels comfortable after most skincare products.
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Sensitivity;

const styles = StyleSheet.create({
  section: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 5,
  },
  paragraph: {
    fontSize: 14,
    flexShrink: 1,
    flexWrap: "wrap",
    color: "#888",
  },
  checkbox: {
    marginRight: 10,
    marginTop: 3,
  },
  subtitle: {
    fontSize: 16,
    color: "#555454ff",
    textAlign: "center",
    marginBottom: 10,
  },
});
