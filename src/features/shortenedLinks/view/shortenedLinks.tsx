import BaseView from "@/src/components/baseView/baseView";
import CallToActionHeader from "../components/callToActionHeader/callToActionHeader";
import UrlSubmitForm from "../components/urlSubmitForm/urlSubmitForm";

function ShortenedLinks() {
  return (
    <BaseView>
      <CallToActionHeader />

      <UrlSubmitForm />
    </BaseView>
  );
}

export default ShortenedLinks;
