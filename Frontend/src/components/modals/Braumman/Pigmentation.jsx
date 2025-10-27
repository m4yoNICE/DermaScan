import { StyleSheet, Text, View } from "react-native";
import Checkbox from "expo-checkbox";
import React, { useEffect, useState } from "react";

const Pigmentation = ({ onChange }) => {
  const [one, setOne] = useState(false);
  const [two, setTwo] = useState(false);
  const [three, setThree] = useState(false);
  const [four, setFour] = useState(false);
  const [five, setFive] = useState(false);

  useEffect(() => {
    const pigmented = [one, two, three].filter(Boolean).length;
    const nonpigmented = [four, five].filter(Boolean).length;

    if (pigmented > nonpigmented) onChange("pigmented");
    else if (nonpigmented > pigmented) onChange("non-pigmented");
  }, [one, two, three, four, five]);
  return (
    <View>
      <Text style={styles.subtitle}>
        Section 3: Pigmentation (Pigmented vs Non-Pigmented)
      </Text>
      <View style={styles.section}>
        <Checkbox style={styles.checkbox} value={one} onValueChange={setOne} />
        <Text style={[styles.paragraph, { flex: 1 }]}>
          I have freckles, dark spots, or uneven skin tone.
        </Text>
      </View>

      <View style={styles.section}>
        <Checkbox style={styles.checkbox} value={two} onValueChange={setTwo} />
        <Text style={[styles.paragraph, { flex: 1 }]}>
          My skin tans easily after sun exposure.
        </Text>
      </View>

      <View style={styles.section}>
        <Checkbox
          style={styles.checkbox}
          value={three}
          onValueChange={setThree}
        />
        <Text style={[styles.paragraph, { flex: 1 }]}>
          I use sunscreen often because my skin darkens fast.
        </Text>
      </View>

      <View style={styles.section}>
        <Checkbox
          style={styles.checkbox}
          value={four}
          onValueChange={setFour}
        />
        <Text style={[styles.paragraph, { flex: 1 }]}>
          My skin tone is even and rarely changes in color.
        </Text>
      </View>

      <View style={styles.section}>
        <Checkbox
          style={styles.checkbox}
          value={five}
          onValueChange={setFive}
        />
        <Text style={[styles.paragraph, { flex: 1 }]}>
          I don’t notice any spots or discoloration.
        </Text>
      </View>
    </View>
  );
};

export default Pigmentation;

const styles = StyleSheet.create({
  section: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 5,
  },
  paragraph: {
    fontSize: 16,
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
