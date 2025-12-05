import Button from "@/components/Button";
import Card from "@/components/Card";
import { ToastMessage } from "@/components/ToastMessage";
import Fontisto from "@expo/vector-icons/Fontisto";
import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const Aging = ({ onDone }) => {
  const flatRef = useRef(null);
  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState({});

  const questions = [
    "I already see fine lines around my eyes or mouth.",
    "I stay up late or smoke, and I notice my skin looks tired.",
    "My skin feels firm and bounces back when I touch it.",
    "I don’t see wrinkles or sagging yet.",
    "My skin looks dull or less elastic than before.",
  ];

  const handleSelect = (index, value) => {
    setAnswers((prev) => ({ ...prev, [index]: value === "yes" }));
  };

  const handleNext = () => {
    if (answers[page] === undefined) {
      ToastMessage("error", "Please answer first", "Choose Yes or No.");
      return;
    }

    if (page < 4) {
      flatRef.current.scrollToIndex({ index: page + 1 });
      setPage(page + 1);
      return;
    }

    const wrinkled = [answers[0], answers[1], answers[4]].filter(
      Boolean
    ).length;
    const tight = [answers[2], answers[3]].filter(Boolean).length;

    const result = wrinkled > tight ? "wrinkled" : "tight";

    console.log(result);
    onDone(result);
  };

  const handleBack = () => {
    if (page === 0) return;
    flatRef.current.scrollToIndex({ index: page - 1 });
    setPage(page - 1);
  };

  return (
    <View style={styles.container}>
      {/* CARD */}
      <View style={styles.pagerWrapper}>
        <FlatList
          ref={flatRef}
          data={questions}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          style={{ flex: 1 }} // IMPORTANT
          contentContainerStyle={{ flexGrow: 1 }} // IMPORTANT
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item, index }) => (
            <View style={{ width }}>
              <Card style={styles.card}>
                <Text style={styles.qText}>{item}</Text>

                {/* YES */}
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSelect(index, "yes")}
                >
                  <Fontisto
                    name={
                      answers[index] === true
                        ? "radio-btn-active"
                        : "radio-btn-passive"
                    }
                    size={22}
                    color="#00CC99"
                  />
                  <Text style={styles.optionText}>Yes</Text>
                </TouchableOpacity>

                {/* NO */}
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSelect(index, "no")}
                >
                  <Fontisto
                    name={
                      answers[index] === false
                        ? "radio-btn-active"
                        : "radio-btn-passive"
                    }
                    size={22}
                    color="#00CC99"
                  />
                  <Text style={styles.optionText}>No</Text>
                </TouchableOpacity>

                {/* DOTS INSIDE CARD */}
                <View style={styles.dotsRow}>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <View
                      key={i}
                      style={[styles.dot, page === i && styles.activeDot]}
                    />
                  ))}
                </View>
              </Card>
            </View>
          )}
        />
      </View>

      {/* BUTTONS BELOW CARD */}
      <View style={styles.buttonRow}>
        <Button
          title="Previous"
          onPress={handleBack}
          style={[styles.btn, page === 0 ? styles.disabledBtn : styles.prevBtn]}
          textStyle={styles.btnText}
        />

        <Button
          title={page === 4 ? "Finish" : "Next"}
          onPress={handleNext}
          style={styles.nextBtn}
          textStyle={styles.btnText}
        />
      </View>
    </View>
  );
};

export default Aging;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "white",
  },

  pagerWrapper: {
    width: "100%",
    minHeight: 260, // 💚 FIXES THE COMPRESSION
  },
  buttonRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  card: {
    marginHorizontal: 20, // spacing WITHOUT affecting FlatList width
    paddingBottom: 30,
  },

  qText: {
    fontSize: 18,
    marginBottom: 16,
    fontWeight: "600",
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },

  optionText: {
    marginLeft: 10,
    fontSize: 16,
  },

  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },

  dot: {
    width: 8,
    height: 8,
    backgroundColor: "#ccc",
    borderRadius: 50,
    marginHorizontal: 4,
  },

  activeDot: {
    backgroundColor: "#00CC99",
  },

  btn: {
    width: 120,
    paddingVertical: 8,
    borderRadius: 8,
  },

  disabledBtn: {
    backgroundColor: "#2F8F7A",
  },

  prevBtn: {
    backgroundColor: "#00CC99",
  },

  nextBtn: {
    width: 120,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#00CC99",
    color: "white",
    fontWeight: "600",
  },

  btnText: {
    color: "black",
    fontWeight: "600",
  },
});
