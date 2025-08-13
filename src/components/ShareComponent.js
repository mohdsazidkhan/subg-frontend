import { FaWhatsapp, FaTelegramPlane, FaInstagram, FaFacebook, FaShare } from "react-icons/fa";

const ShareComponent = ({ url, text }) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: text,
          text: text,
          url: url,
        });
        console.log("Shared successfully!");
      } catch (err) {
        console.error("Share failed:", err);
      }
    }
  };
  
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  return (
    <div>
      <div className="flex justify-center space-x-4 mt-2">
      {isMobile ? (
        <span className="text-white text-sm font-medium mb-1">and</span>
      )
      :
      (
        <span className="text-white text-sm font-medium mb-1">Share On</span>
      )}
    </div>
    <div className="flex justify-center space-x-4 mt-2">
      {isMobile && navigator.share ? (
        <button
  onClick={handleNativeShare}
  className="
    px-4 py-2 
    bg-gradient-to-r from-blue-500 to-indigo-600
    text-white font-semibold
    rounded-lg shadow-lg
    hover:from-blue-600 hover:to-indigo-700
    hover:shadow-xl
    transition-all duration-300 ease-in-out
    flex items-center gap-2
  "
>
  <FaShare/>
  Share
</button>

      ) : (
        <>
          <a
            href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#25D366", fontSize: "24px" }}
          >
            <FaWhatsapp />
          </a>
          <a
            href={`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#0088cc", fontSize: "24px" }}
          >
            <FaTelegramPlane />
          </a>
          <a
            href={`https://www.instagram.com/?url=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#E1306C", fontSize: "24px" }}
          >
            <FaInstagram />
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#3b5998", fontSize: "24px" }}
          >
            <FaFacebook />
          </a>
        </>
      )}
    </div>
    </div>
  );
};

export default ShareComponent;