import { useEffect, useState } from "react";
import { clientSupabase } from "../../supabase/clientSupabase";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { DBTableTypeFinder } from "../../supabase/dbTableTypeFinder";
import { useQuery } from "react-query";

export default function TabOneScreen() {
  const { threadId, title } = useLocalSearchParams<{
    threadId: string;
    title: string;
  }>();
  const [messageList, setMessageList] = useState([] as IMessage[]);
  const navigation = useNavigation();

  useQuery({
    queryKey: ["thread", threadId],
    queryFn: async () => {
      const msgs = (
        await clientSupabase
          .from("Message")
          .select("*, User (username)")
          .eq("threadId", threadId)
          .order("created_at", { ascending: false })
      ).data!.map((item) => generateMessage(item));
      setMessageList(msgs);
    },
  });

  const { data: user } = useQuery({
    queryKey: "user",
    queryFn: async () => (await clientSupabase.auth.getUser()).data.user!,
  });

  const generateMessage = (data: DBTableTypeFinder<"Message">) => {
    console.log(data);
    return {
      _id: data.id,
      text: data.content,
      createdAt: new Date(data.created_at),
      user: {
        _id: data.userId,
        name: data.User?.username ?? "Unknown",
        // replace when profile upload functionality
        avatar:
          "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg",
      },
    };
  };

  useEffect(() => {
    navigation.setOptions({ headerTitle: title });

    const realtimeMessages = clientSupabase
      .channel(`thread${threadId}user${user?.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Message",
          filter: `threadId=eq.${threadId}`,
        },
        ({ new: data }) => {
          setMessageList((messages) => [generateMessage(data), ...messages]);
        }
      )
      .subscribe();

    return () => {
      clientSupabase.removeChannel(realtimeMessages);
    };
  }, []);

  const onSend = async (messages: IMessage[]) => {
    const lastMessage = messages[0];

    await clientSupabase.from("Message").insert({
      content: lastMessage!.text,
      threadId: Number(threadId),
      userId: user?.id!,
    });
  };

  return (
    <GiftedChat
      messages={messageList}
      onSend={onSend}
      disableComposer={!user?.id}
      user={{
        _id: user?.id ?? -1,
      }}
      keyboardShouldPersistTaps="never"
      renderUsernameOnMessage
    />
  );
}
