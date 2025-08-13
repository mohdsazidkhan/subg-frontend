import {
  FaWhatsapp,
  FaTelegramPlane,
  FaInstagram,
  FaFacebook,
  FaShare,
  FaTwitter,
  FaLinkedin,
  FaReddit,
  FaPinterest,
  FaEnvelope,
  FaSms,
} from "react-icons/fa";

const TooltipIcon = ({ children, label, color }) => (
  <div className="relative group flex items-center justify-center">
    <span
      className="text-2xl cursor-pointer transition-transform transform hover:scale-110"
      style={{ color }}
    >
      {children}
    </span>
    <div className="absolute bottom-full mb-2 hidden group-hover:block whitespace-nowrap bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      {label}
    </div>
  </div>
);

const ShareComponent = ({ url, text, imageUrl }) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);
  const telegramTextFirst = encodeURIComponent(`${text}\n\n${url}`);
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: text, text: text, url: url });
      } catch (err) {
        console.error("Share failed:", err);
      }
    }
  };

  const handleInstagramShare = () => {
    navigator.clipboard
      .writeText(`${text}\n\n${url}`)
      .then(() => {
        alert("Referral message copied! Paste it into your Instagram post or story.");
        window.open("https://www.instagram.com/", "_blank");
      })
      .catch(() => {
        window.open("https://www.instagram.com/", "_blank");
      });
  };

  return (
    <div>
      <div className="flex justify-center space-x-4 mt-2">
        {isMobile ? (
          <span className="text-white text-sm font-medium mb-1">and</span>
        ) : (
          <span className="text-white text-sm font-medium mb-1">Share On</span>
        )}
      </div>

      <div className="flex justify-center space-x-4 mt-3 flex-wrap gap-4">
        {isMobile && navigator.share ? (
          <button
            onClick={handleNativeShare}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl transition-all duration-300 ease-in-out flex items-center gap-2"
          >
            <FaShare />
            Share
          </button>
        ) : (
          <>
            <a
              href={`https://wa.me/?text=${encodedText}%0A${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <TooltipIcon label="WhatsApp" color="#25D366">
                <FaWhatsapp />
              </TooltipIcon>
            </a>

            <a
              href={`https://t.me/share/url?text=${telegramTextFirst}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <TooltipIcon label="Telegram" color="#0088cc">
                <FaTelegramPlane />
              </TooltipIcon>
            </a>

            <button onClick={handleInstagramShare}>
              <TooltipIcon label="Instagram" color="#E1306C">
                <FaInstagram />
              </TooltipIcon>
            </button>

            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <TooltipIcon label="Facebook" color="#3b5998">
                <FaFacebook />
              </TooltipIcon>
            </a>

            <a
              href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <TooltipIcon label="Twitter / X" color="#1DA1F2">
                <FaTwitter />
              </TooltipIcon>
            </a>

            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <TooltipIcon label="LinkedIn" color="#0077b5">
                <FaLinkedin />
              </TooltipIcon>
            </a>

            <a
              href={`https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedText}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <TooltipIcon label="Reddit" color="#FF4500">
                <FaReddit />
              </TooltipIcon>
            </a>

            <a
              href={`https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodeURIComponent(
                imageUrl || ""
              )}&description=${encodedText}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <TooltipIcon label="Pinterest" color="#E60023">
                <FaPinterest />
              </TooltipIcon>
            </a>

            <a
              href={`mailto:?subject=${encodeURIComponent(
                "Check this out!"
              )}&body=${encodedText}%20${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <TooltipIcon label="Email" color="#D44638">
                <FaEnvelope />
              </TooltipIcon>
            </a>

            <a
              href={`sms:?&body=${encodedText}%20${encodedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <TooltipIcon label="SMS" color="#34B7F1">
                <FaSms />
              </TooltipIcon>
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default ShareComponent;
