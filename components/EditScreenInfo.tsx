
import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import Colors from '../constants/Colors';
import { ExternalLink } from './ExternalLink';
import { MonoText } from './StyledText';
import { Text } from './Themed';
      import { useEffect, useState } from "react";
import { adminSupabase } from "../supabase/AdminSupabase";

export default function EditScreenInfo({ path }: { path: string }) {
         const [topicList, setTopicList] = useState([] as string[]);

  useEffect(() => {
    (async () => {
      const { data } = await adminSupabase.from("TopicRoom").select();
      setTopicList(data!.map((item) => item.topic));
    })();
  }, []);
  // Sample data for the FlatList
  const data = [
    { id: '1', title: 'Element 1' },
    { id: '2', title: 'Element 2' },
    { id: '3', title: 'Element 3' },
    { id: '4', title: 'Element 4' },
    { id: '5', title: 'Element 5' },
  ];

  return (
    <View>
      {/* FlatList with 5 elements */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listItemText}>{item.title}</Text>
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
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Colors.light.background, // You can use any color you like
    padding: 20, // Increase padding for a wider appearance
    borderRadius: 8,
    marginVertical: 10,
    width: '100%', // Stretch the box from one end to the other
  },
  listItemText: {
    fontSize: 16,
    color: 'black',
  },
  roundedSquare: {
    backgroundColor: Colors.light.tint, // You can use any color you like
    height: 50,
    width: '100%',
    borderRadius: 10,
    marginTop: 20,
  },
});
