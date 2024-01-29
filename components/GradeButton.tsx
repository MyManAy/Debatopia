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

  const handleGrade = () => {
    setIsLoading(true);
    fetch(
      `https://emailconfirmation.lumedebate.com/api/openAI?threadId=${threadId}&title=${title}`,
      { method: "POST", body: JSON.stringify(messages) }
    )
      .then(() => {
        crossPlatformAlert(
          `Thread has been graded! Please refresh the ${
            Platform.OS === "web" ? "page" : "app"
          } to view`
        );
      })
      .catch(() =>
        crossPlatformAlert("Something went wrong! Please try again.")
      )
      .finally(() => setIsLoading(false));
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
