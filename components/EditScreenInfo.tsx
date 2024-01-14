import { StyleSheet, View, FlatList } from "react-native";
import Colors from "../constants/Colors";
import { Text } from "./Themed";
import { useEffect, useState } from "react";
import { adminSupabase } from "../supabase/clientSupabase";
import Auth from "./Auth";

export default function EditScreenInfo({ path }: { path: string }) {
  const [topicList, setTopicList] = useState([] as string[]);

  useEffect(() => {
    (async () => {
      const { data } = await adminSupabase.from("TopicRoom").select();
      setTopicList(data!.map((item) => item.topic));
    })();
  }, []);
  return (
    <View>
      <Auth />
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
  // Updated style for the FlatList and rounded square
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
