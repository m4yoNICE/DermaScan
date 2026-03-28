import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import Button from "@/components/designs/Button";
import Api from "@/services/Api";

const ProductDetailSheet = ({
  sheetRef,
  schedule,
  time,
  products = [],
  isDone,
  onMarkDone,
}) => {
  const isMorning = schedule === "Morning";

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={["80%"]}
      enablePanDownToClose
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        />
      )}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handle}
      style={{ borderRadius: 0 }}
    >
      <BottomSheetScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetEmoji}>{isMorning ? "🌅" : "🌙"}</Text>
          <View>
            <Text style={styles.sheetTitle}>{schedule} Routine</Text>
            <Text style={styles.sheetSub}>
              {products.length} product{products.length !== 1 ? "s" : ""} ·{" "}
              {time}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {products.map((p, i) => (
          <View key={i}>
            <View style={styles.productRow}>
              <Image
                source={{ uri: Api.getProductImage(p.productImage) }}
                style={styles.productImg}
              />
              <View style={styles.productBody}>
                <Text style={styles.productName}>{p.productName}</Text>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeText}>{p.productType}</Text>
                </View>
                <Text style={styles.instructions}>{p.instructions}</Text>
              </View>
            </View>
            {i < products.length - 1 && <View style={styles.rowDivider} />}
          </View>
        ))}

        <Button
          title={isDone ? "Already Done ✓" : "Mark as Done"}
          onPress={onMarkDone}
          disabled={isDone}
          style={[styles.button, isDone && styles.buttonDone]}
          textStyle={isDone ? styles.buttonDoneText : null}
        />
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default ProductDetailSheet;

const styles = StyleSheet.create({
  sheetBackground: {
    borderRadius: 40,
  },
  handle: {
    backgroundColor: "#ccc",
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 36,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 16,
  },
  sheetEmoji: {
    fontSize: 32,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  sheetSub: {
    fontSize: 13,
    color: "#999",
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginBottom: 8,
  },
  productRow: {
    flexDirection: "row",
    gap: 14,
    paddingVertical: 16,
  },
  productImg: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
  },
  productBody: {
    flex: 1,
    gap: 6,
  },
  productName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  typeBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#e6faf5",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  typeText: {
    fontSize: 11,
    color: "#00CC99",
    fontWeight: "600",
  },
  instructions: {
    fontSize: 13,
    color: "#555",
    lineHeight: 20,
  },
  rowDivider: {
    height: 1,
    backgroundColor: "#f5f5f5",
  },
  button: {
    marginTop: 24,
  },
  buttonDone: {
    backgroundColor: "#e6faf5",
    elevation: 0,
    shadowOpacity: 0,
  },
  buttonDoneText: {
    color: "#00CC99",
  },
});
