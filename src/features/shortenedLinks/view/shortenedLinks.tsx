import BaseView from "@/src/components/baseView/baseView";
import CallToActionHeader from "../components/callToActionHeader/callToActionHeader";
import UrlSubmitForm from "../components/urlSubmitForm/urlSubmitForm";
import useShortenedLinks from "../viewmodel/useShortenedLinks";

function ShortenedLinks() {

  const { addShortenedLink } = useShortenedLinks();

  return (
    <BaseView>
      <CallToActionHeader />
      <UrlSubmitForm onSubmit={addShortenedLink} />
    </BaseView>
  );
}

export default ShortenedLinks;
