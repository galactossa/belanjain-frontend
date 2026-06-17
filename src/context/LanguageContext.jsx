import { createContext, useContext } from "react";
import useLocalStorageState from "../untils/useLocalStorageState";
import { texts } from "../components/customer/profile/pengaturanTexts";

// Languages didefinisikan langsung di sini (tidak import dari data/)
const languages = [
  { id: "id", name: "Bahasa Indonesia" },
  { id: "en-uk", name: "English (UK)" },
  { id: "en-us", name: "English (US)" },
  { id: "zh", name: "中文 (简体)" },
];

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useLocalStorageState("language", "id");
  const currentText = texts[language] || texts.id;

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, currentText, languages }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
