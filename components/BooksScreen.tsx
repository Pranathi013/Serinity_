
import React, { useState } from 'react';
import { generateBookContent } from '../services/geminiService';
import { BookContentResult, BookChapter } from '../types';

interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  imageUrl: string;
}

const books: Book[] = [
  {
    id: 1,
    title: "The Power of Now",
    author: "Eckhart Tolle",
    description: "A guide to spiritual enlightenment and living in the present moment.",
    imageUrl: "https://i.pinimg.com/originals/74/58/d6/7458d61c2e197f7eb62d85338f5ef450.png",
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    description: "An easy & proven way to build good habits & break bad ones.",
    imageUrl: "https://www.qutglass.com/wp-content/uploads/2021/10/C2C70CC4-C2DE-4BE5-83E5-628F59496D68.png",
  },
  {
    id: 3,
    title: "Man's Search for Meaning",
    author: "Viktor E. Frankl",
    description: "A classic tribute to hope from the Holocaust.",
    imageUrl: "https://covers.shakespeareandcompany.com/97818460/9781846042843.jpg",
  },
  {
    id: 4,
    title: "Daring Greatly",
    author: "Brené Brown",
    description: "How the courage to be vulnerable transforms the way we live, love, parent, and lead.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/8/8e/Daring_Greatly_Book_Cover.png",
  },
];

const LanguageSelectionModal: React.FC<{
  bookTitle: string;
  onSelectLanguage: (language: string) => void;
  onClose: () => void;
}> = ({ bookTitle, onSelectLanguage, onClose }) => {
    const languages = [
        "English", "Spanish", "French", "German", "Mandarin Chinese", "Hindi", "Arabic", "Portuguese",
        "Bengali", "Russian", "Japanese", "Lahnda", "Javanese", "Wu Chinese", "Telugu", "Turkish",
        "Korean", "Marathi", "Tamil", "Vietnamese", "Urdu", "Italian", "Dutch", "Polish", "Ukrainian"
    ];
    const [searchTerm, setSearchTerm] = useState('');
    
    const filteredLanguages = languages.filter(lang => lang.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all flex flex-col h-[80vh]" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b flex justify-between items-center flex-shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-brand-gray-darkest">Select Language</h2>
                        <p className="text-sm text-brand-gray">Choose a language for "{bookTitle}"</p>
                    </div>
                     <button onClick={onClose} className="p-1 rounded-full hover:bg-brand-gray-light">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                 <div className="p-4 flex-shrink-0">
                    <input
                        type="text"
                        placeholder="Search for a language..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-brand-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                    />
                </div>
                <ul className="flex-1 overflow-y-auto p-4 space-y-2">
                    {filteredLanguages.map(lang => (
                        <li key={lang}>
                            <button
                                onClick={() => onSelectLanguage(lang)}
                                className="w-full text-left p-3 rounded-lg hover:bg-brand-gray-lightest transition-colors text-brand-gray-darkest font-medium"
                            >
                                {lang}
                            </button>
                        </li>
                    ))}
                    {filteredLanguages.length === 0 && (
                        <p className="text-center text-brand-gray">No languages found.</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

const BookReaderModal: React.FC<{
  book: Book;
  content: BookContentResult | null;
  isLoading: boolean;
  onClose: () => void;
}> = ({ book, content, isLoading, onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const handleNext = () => {
    if (content && currentPage < content.length - 1) {
      setCurrentPage(p => p + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(p => p - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all flex flex-col h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-brand-gray-darkest">{book.title}</h2>
            <p className="text-sm text-brand-gray">by {book.author}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-brand-gray-light">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 flex-1 overflow-y-auto">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-10 h-10 border-4 border-brand-gray-light border-t-brand-blue rounded-full animate-spin"></div>
              <p className="text-brand-gray-dark mt-4 font-semibold">Generating book content...</p>
            </div>
          )}
          {content && content.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-brand-gray-darkest mb-2 pb-2 border-b">{content[currentPage].title}</h3>
              <p className="text-brand-gray-dark whitespace-pre-wrap leading-relaxed">{content[currentPage].content}</p>
            </div>
          )}
          {!isLoading && (!content || content.length === 0) && (
             <div className="text-center p-8 flex flex-col items-center justify-center h-full">
                <p className="text-brand-gray">Sorry, we couldn't generate the content for this book. Please try again later.</p>
             </div>
          )}
        </div>
         {content && content.length > 0 && (
             <div className="p-4 border-t flex justify-between items-center flex-shrink-0">
                <button onClick={handlePrev} disabled={currentPage === 0} className="px-4 py-2 flex items-center space-x-2 bg-brand-gray-light font-semibold text-brand-gray-darkest rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-gray-light/80">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    <span>Previous</span>
                </button>
                <span className="text-sm font-medium text-brand-gray">Chapter {currentPage + 1} of {content.length}</span>
                <button onClick={handleNext} disabled={currentPage === content.length - 1} className="px-4 py-2 flex items-center space-x-2 bg-brand-gray-light font-semibold text-brand-gray-darkest rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-gray-light/80">
                    <span>Next</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                </button>
             </div>
         )}
      </div>
    </div>
  );
};

const BookCard: React.FC<{ book: Book; onReadBook: () => void }> = ({ book, onReadBook }) => (
  <div
    onClick={onReadBook}
    className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col sm:flex-row cursor-pointer group transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
  >
    <img src={book.imageUrl} alt={book.title} className="w-full sm:w-1/3 h-48 sm:h-auto object-cover" />
    <div className="p-5 flex flex-col justify-between">
      <div>
        <h3 className="font-bold text-lg text-brand-gray-darkest">{book.title}</h3>
        <p className="text-sm text-brand-gray font-medium">by {book.author}</p>
        <p className="mt-2 text-sm text-brand-gray-dark">{book.description}</p>
      </div>
      <div 
        className="mt-4 w-full sm:w-auto self-start py-2 px-4 bg-brand-blue-light text-brand-blue-dark font-semibold rounded-lg group-hover:bg-brand-blue-light/80 transition-colors">
        Read Now
      </div>
    </div>
  </div>
);

const BooksScreen: React.FC = () => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [bookContent, setBookContent] = useState<BookContentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
    setIsLanguageModalOpen(true);
  };

  const handleGenerateContentWithLanguage = async (language: string) => {
    if (!selectedBook) return;

    setIsLanguageModalOpen(false);
    setIsLoading(true);
    setBookContent(null);
    try {
      const result = await generateBookContent(selectedBook.title, selectedBook.author, language);
      setBookContent(result);
    } catch (error) {
      console.error(error);
      setBookContent(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
    setBookContent(null);
    setIsLanguageModalOpen(false);
  };

  return (
    <div className="p-5 space-y-6 bg-brand-sky-blue min-h-full">
      <header className="px-2">
        <h1 className="text-2xl font-bold text-brand-gray-darkest">Wellness Library</h1>
        <p className="text-brand-gray">Curated books to support your journey.</p>
      </header>
      <section className="space-y-4">
        {books.map(book => <BookCard key={book.id} book={book} onReadBook={() => handleSelectBook(book)} />)}
      </section>

      {isLanguageModalOpen && selectedBook && (
        <LanguageSelectionModal
          bookTitle={selectedBook.title}
          onSelectLanguage={handleGenerateContentWithLanguage}
          onClose={handleCloseModal}
        />
      )}
      
      {selectedBook && !isLanguageModalOpen && (
        <BookReaderModal
          book={selectedBook}
          content={bookContent}
          isLoading={isLoading}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default BooksScreen;
