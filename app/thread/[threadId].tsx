import { useEffect, useState } from "react";
import { clientSupabase } from "../../supabase/clientSupabase";
import { useLocalSearchParams } from "expo-router";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { DBTableTypeFinder } from "../../supabase/dbTableTypeFinder";

export default function TabOneScreen() {
  const { threadId }: { threadId: string } = useLocalSearchParams();
  const [messageList, setMessageList] = useState([] as IMessage[]);
  const [currentUserId, setCurrentUserId] = useState(null as string | null);

  const generateMessage = (
    data: DBTableTypeFinder<"Message"> & { User: { username: string } }
  ) => ({
    _id: data.id,
    text: data.content,
    createdAt: new Date(data.created_at),
    user: {
      // replace with actual user
      _id: data.userId,
      name: data.User?.username ?? "Loading",
      avatar:
        "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg",
    },
  });

  useEffect(() => {
    (async () => {
      setCurrentUserId((await clientSupabase.auth.getUser()).data.user!.id);

      const { data } = await clientSupabase
        .from("Message")
        .select(`*, User (username)`)
        .eq("threadId", threadId)
        .order("created_at", { ascending: false });
      setMessageList(data!.map((item: any) => generateMessage(item)));
    })();

    const realtimeMessages = clientSupabase
      .channel(`thread${threadId}user${currentUserId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Message",
          filter: `threadId=eq.${threadId}`,
        },
        ({ new: data }) => {
          // if (data.userId !== currentUserId) {
          // }
          setMessageList((messages) => [
            generateMessage(data as any),
            ...messages,
          ]);
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
      userId: currentUserId!,
    });
  };

  return (
    <GiftedChat
      messages={messageList}
      onSend={onSend}
      user={{
        _id: currentUserId ?? 1,
      }}
      keyboardShouldPersistTaps="never"
      renderUsernameOnMessage
    />
  );
}
