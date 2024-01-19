import { View } from "../../components/Themed";

export default function Loading() {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.innerContainer}>
        <div style={styles.loading}>Loading...</div>
      </View>
    </View>
  );
}

const styles = {
  mainContainer: {
    display: "flex",
    padding: 60,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: "100%",
  },
  innerContainer: {
    display: "flex",
    position: "relative",
    flexDirection: "column",
    gap: 60,
    alignItems: "center",
  },
  loading: {
    fontSize: "3.75rem",
    lineHeight: 1,
    fontWeight: 600,
    color: "#000000",
  },
} as const;
