import { StyleSheet, Text, View } from "react-native";
import Checkbox from "expo-checkbox";
import React, { useEffect, useState } from "react";

const Hydration = ({ onChange }) => {
  const [one, setOne] = useState(false);
  const [two, setTwo] = useState(false);
  const [three, setThree] = useState(false);
  const [four, setFour] = useState(false);
  const [five, setFive] = useState(false);

  useEffect(() => {
    const dryCount = [one, three].filter(Boolean).length;
    const oilyCount = [two, four, five].filter(Boolean).length;

    if (dryCount > oilyCount) onChange("dry");
    else if (oilyCount > dryCount) onChange("oily");
    else onChange("normal");
  }, [one, two, three, four, five]);
  return (
    <View>
      <Text style={styles.subtitle}>Section 1: Hydration (Dry vs Oily)</Text>
      <View style={styles.section}>
        <Checkbox style={styles.checkbox} value={one} onValueChange={setOne} />
        <Text style={[styles.paragraph, { flex: 1 }]}>
          My skin feels tight or rough after washing.
        </Text>
      </View>

      <View style={styles.section}>
        <Checkbox style={styles.checkbox} value={two} onValueChange={setTwo} />
        <Text style={[styles.paragraph, { flex: 1 }]}>
          My face often looks shiny or greasy, even without lotion.
        </Text>
      </View>

      <View style={styles.section}>
        <Checkbox
          style={styles.checkbox}
          value={three}
          onValueChange={setThree}
        />
        <Text style={[styles.paragraph, { flex: 1 }]}>
          I get flaky or peeling areas on my skin.
        </Text>
      </View>

      <View style={styles.section}>
        <Checkbox
          style={styles.checkbox}
          value={four}
          onValueChange={setFour}
        />
        <Text style={[styles.paragraph, { flex: 1 }]}>
          My makeup fades or slides off quickly.
        </Text>
      </View>

      <View style={styles.section}>
        <Checkbox
          style={styles.checkbox}
          value={five}
          onValueChange={setFive}
        />
        <Text style={[styles.paragraph, { flex: 1 }]}>
          I rarely need moisturizer.
        </Text>
      </View>
    </View>
  );
};

export default Hydration;

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
