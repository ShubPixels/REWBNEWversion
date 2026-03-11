      

      {/* WhatsApp Chat Box */}
      
      <a
        href="https://wa.me/918000920222?text=Hi%20there"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-500 text-white px-3 py-2 rounded ml-2 flex items-center justify-center"
      >
        ➤
      </a>

      



      {/* Back-to-Top Button */}
      {isTopButtonVisible && (
        <button onClick={scrollToTop} className="fixed bottom-6 right-6 bg-cyan-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-cyan-600 transition-all duration-200">
          ⬆
        </button>
      )}