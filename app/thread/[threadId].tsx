import { FlatList, StyleSheet } from "react-native";

import { View, Text } from "../../components/Themed";
import { useEffect, useState } from "react";
import Colors from "../../constants/Colors";
import { clientSupabase } from "../../supabase/clientSupabase";
import { DBTableTypeFinder } from "../../supabase/dbTableTypeFinder";
import { useLocalSearchParams } from "expo-router";

export default function TabOneScreen() {
  const { threadId } = useLocalSearchParams();
  const [messageList, setMessageList] = useState(
    [] as DBTableTypeFinder<"Message">[]
  );

  useEffect(() => {
    (async () => {
      const { data } = await clientSupabase
        .from("Message")
        .select()
        .eq("threadId", threadId);
      setMessageList(data!);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={messageList}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>{item.content}</Text>
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
