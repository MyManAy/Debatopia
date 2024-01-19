import { useEffect, useState } from "react";
import EmailInfo from "./EmailInfo";
import Loading from "./Loading";

export default function Home() {
  const [url, setUrl] = useState(null as null | string);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const findErrorDescription = (url: string) => {
    const roughlySplitByVariable = url.split("&");
    const errorDescriptionString = roughlySplitByVariable.find((item) =>
      item.match(/^error_description/)
    );
    return errorDescriptionString?.split("=")[1].replaceAll("+", " ");
  };

  return url ? (
    url.includes("access_token") ? (
      <EmailInfo
        header="Your Email Has Been Confirmed! 🎉🎉"
        imageSrc={require("../../assets/images/email.png")}
        description="You May Close This Tab and Sign Back In"
      />
    ) : (
      <EmailInfo
        header="Your Email Confirmation Failed"
        imageSrc={require("../../assets/images/email-error.png")}
        description={findErrorDescription(url) ?? "Please Try Again"}
      />
    )
  ) : (
    <Loading />
  );
}
