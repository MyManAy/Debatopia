import { Button, Platform } from "react-native";
import crossPlatformAlert from "../utils/crossPlatformAlert";
import { useState } from "react";
import { DBTableTypeFinder } from "../supabase/dbTableTypeFinder";

type Props = {
  threadId: number;
  title: string;
  disabled: boolean;
  messages: Omit<DBTableTypeFinder<"Message">, "threadId" | "created_at">[];
};

const GradeButton = ({ threadId, title, disabled, messages }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  type FetchRetryProps = {
    url: string;
    tries: number;
    onSuccess: () => void;
    options: RequestInit;
  };

  async function fetchRetry({
    url,
    tries,
    onSuccess,
    options,
  }: FetchRetryProps) {
    function onError(err: any): any {
      if (tries === 0) {
        throw err;
      }
      return fetchRetry({ url, tries: tries - 1, onSuccess, options });
    }
    return fetch(url, options).then(onSuccess).catch(onError);
  }

  const handleGrade = async () => {
    console.log(messages);
    setIsLoading(true);
    await fetchRetry({
      url: `https://emailconfirmation.lumedebate.com/api/openAI?threadId=${threadId}&title=${title}`,
      tries: 3,
      onSuccess: () => {
        setIsLoading(false);
        crossPlatformAlert(
          `Thread has been graded! Please refresh the ${
            Platform.OS === "web" ? "page" : "app"
          } to view`
        );
      },
      options: { method: "POST", body: JSON.stringify(messages) },
    });
  };

  return (
    <Button
      title={"Grade"}
      onPress={handleGrade}
      disabled={isLoading || disabled}
    />
  );
};
export default GradeButton;
