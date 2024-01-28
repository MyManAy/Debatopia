import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { StyleSheet } from "react-native";
import { Icon } from "react-native-elements";

const Timer = ({ timeRemaining }: { timeRemaining: number }) => {
  const [time, setTime] = useState(timeRemaining);
  const [color, setColor] = useState("black");

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => prevTime - 1000);
    }, 1000);

    if (time <= timeRemaining / 5) setColor("red");

    if (time === 0) clearInterval(interval!);

    return () => {
      clearInterval(interval);
    };
  }, [time]);

  return (
    <View style={styles.container}>
      <View style={styles.timer}>
        <Text style={{ ...styles.text, color: color }}>
          {("0" + Math.floor((time / 60000) % 60)).slice(-2)}:
        </Text>
        <Text style={{ ...styles.text, color: color }}>
          {("0" + Math.floor((time / 1000) % 60)).slice(-2)}
        </Text>
      </View>
      <Icon name="schedule" type="material" size={40} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 15,
    gap: 15,
  },
  timer: {
    display: "flex",
    flexDirection: "row",
  },
  text: {
    fontSize: 15,
    fontWeight: "500",
  },
});
export default Timer;
