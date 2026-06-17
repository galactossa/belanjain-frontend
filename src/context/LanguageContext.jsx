import { createContext, useContext } from "react";
import useLocalStorageState from "../untils/useLocalStorageState";
import { texts } from "../components/customer/profile/pengaturanTexts";
import { languages } from "../data/language";

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
