import { StyleSheet, Text, View } from "react-native";
import Checkbox from "expo-checkbox";
import React, { useEffect, useState } from "react";

const Aging = ({ onChange }) => {
  const [one, setOne] = useState(false);
  const [two, setTwo] = useState(false);
  const [three, setThree] = useState(false);
  const [four, setFour] = useState(false);
  const [five, setFive] = useState(false);

  useEffect(() => {
    const wrinkled = [one, two, five].filter(Boolean).length;
    const tight = [three, four].filter(Boolean).length;

    if (wrinkled > tight) onChange("wrinkled");
    else if (tight > wrinkled) onChange("tight");
  }, [one, two, three, four, five]);
  return (
    <View>
      <Text style={styles.subtitle}>Section 4: Aging (Wrinkled vs Tight)</Text>
      <View style={styles.section}>
        <Checkbox style={styles.checkbox} value={one} onValueChange={setOne} />
        <Text style={[styles.paragraph, { flex: 1 }]}>
          I already see fine lines around my eyes or mouth.
        </Text>
      </View>

      <View style={styles.section}>
        <Checkbox style={styles.checkbox} value={two} onValueChange={setTwo} />
        <Text style={[styles.paragraph, { flex: 1 }]}>
          I stay up late or smoke, and I notice my skin looks tired.
        </Text>
      </View>

      <View style={styles.section}>
        <Checkbox
          style={styles.checkbox}
          value={three}
          onValueChange={setThree}
        />
        <Text style={[styles.paragraph, { flex: 1 }]}>
          My skin feels firm and bounces back when I touch it.
        </Text>
      </View>

      <View style={styles.section}>
        <Checkbox
          style={styles.checkbox}
          value={four}
          onValueChange={setFour}
        />
        <Text style={[styles.paragraph, { flex: 1 }]}>
          I don’t see wrinkles or sagging yet.
        </Text>
      </View>

      <View style={styles.section}>
        <Checkbox
          style={styles.checkbox}
          value={five}
          onValueChange={setFive}
        />
        <Text style={[styles.paragraph, { flex: 1 }]}>
          My skin looks dull or less elastic than before.
        </Text>
      </View>
    </View>
  );
};

export default Aging;

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
