import { FlatList, StyleSheet } from "react-native";

import { Text, View } from "../components/Themed";
import { useEffect, useState } from "react";
import Colors from "../constants/Colors";
import { adminSupabase } from "../supabase/AdminSupabase";

export default function TabOneScreen() {
  const [topicList, setTopicList] = useState([] as string[]);

  useEffect(() => {
    (async () => {
      const { data } = await adminSupabase.from("TopicRoom").select();
      setTopicList(data!.map((item) => item.topic));
    })();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={topicList}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>{item}</Text>
          </View>
        )}
        style={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    alignItems: "center",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "100%",
  },
  listContainer: {
    marginTop: 20,
  },
  listItem: {
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: Colors.light.background, // You can use any color you like
    padding: 20, // Increase padding for a wider appearance
    borderRadius: 8,
    marginVertical: 10,
    width: "100%", // Stretch the box from one end to the other
  },
  listItemText: {
    fontSize: 16,
    color: "black",
  },
  roundedSquare: {
    backgroundColor: Colors.light.tint, // You can use any color you like
    height: 50,
    width: "100%",
    borderRadius: 10,
    marginTop: 20,
  },
});