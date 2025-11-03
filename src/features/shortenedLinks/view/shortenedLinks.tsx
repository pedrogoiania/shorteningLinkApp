import BaseView from "@/src/components/baseView/baseView";
import CallToActionHeader from "../components/callToActionHeader/callToActionHeader";
import UrlSubmitForm from "../components/urlSubmitForm/urlSubmitForm";
import useShortenedLinks from "../viewmodel/useShortenedLinks";

function ShortenedLinks() {
  const { addShortenedLink, shortenUrlLoading, linkTyped, setLinkTyped } =
    useShortenedLinks();

  return (
    <BaseView>
      <CallToActionHeader />
      <UrlSubmitForm
        onSubmit={addShortenedLink}
        loading={shortenUrlLoading}
        textValue={linkTyped}
        setTextValue={setLinkTyped}
      />
    </BaseView>
  );
}

export default ShortenedLinks;
