import BaseView from "@/src/components/baseView/baseView";
import CallToActionHeader from "../components/callToActionHeader/callToActionHeader";
import ShortenedLinksHistory from "../components/shortenedLinksHistory/shortenedLinksHistory";
import UrlSubmitForm from "../components/urlSubmitForm/urlSubmitForm";
import useShortenedLinks from "../viewmodel/useShortenedLinks";

function ShortenedLinks() {
  const {
    addShortenedLink,
    shortenUrlLoading,
    linkTyped,
    setLinkTyped,
    shortenedLinks,
  } = useShortenedLinks();

  return (
    <BaseView>
      <CallToActionHeader />
      <UrlSubmitForm
        onSubmit={addShortenedLink}
        loading={shortenUrlLoading}
        textValue={linkTyped}
        setTextValue={setLinkTyped}
      />
      <ShortenedLinksHistory shortenedLinks={shortenedLinks} />
    </BaseView>
  );
}

export default ShortenedLinks;
