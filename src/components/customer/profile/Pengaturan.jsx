import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../../../context/LanguageContext";
import PengaturanModal from "./modal/PengaturanModal";

const sectionsConfig = (currentText, languageLabel) => [
  {
    title: currentText.settingsGroup,
    items: [
      { id: "chat", title: currentText.chat },
      { id: "notif", title: currentText.notif },
      { id: "privacy", title: currentText.privacy },
      { id: "blocked", title: currentText.blockedUsers },
      {
        id: "language",
        title: currentText.language,
        subtitle: languageLabel,
      },
    ],
  },
  {
    title: currentText.helpGroup,
    items: [
      { id: "help", title: currentText.helpTitle },
      { id: "rules", title: currentText.rulesTitle },
      { id: "policy", title: currentText.policyTitle },
      { id: "values", title: currentText.valuesTitle },
    ],
  },
  {
    title: currentText.infoGroup,
    items: [
      { id: "info", title: currentText.infoTitle, badge: true },
      { id: "delete", title: currentText.deleteTitle },
    ],
  },
];

function Pengaturan() {
  const [activeModal, setActiveModal] = useState(null);

  const [chatSettings, setChatSettings] = useState({
    notifChat: true,
    statusOnline: true,
    enterSend: true,
    autoReply: false,
  });

  const [notifSettings, setNotifSettings] = useState({
    promo: true,
    pesanan: true,
    newsletter: false,
    akses: true,
  });

  const [privacySettings, setPrivacySettings] = useState({
    privateAccount: true,
    hideHistory: false,
    biometric: false,
    personalizedAds: true,
  });

  const { language, setLanguage, currentText, languages } = useLanguage();

  const languageLabel =
    languages.find((lang) => lang.id === language)?.name ||
    language ||
    "Bahasa Indonesia";

  const sections = sectionsConfig(currentText, languageLabel);

  return (
    <>
      <div className="max-w-2xl mx-auto">
        {sections.map((section) => (
          <div key={section.title} className="mb-8">
            <h3 className="text-[11px] font-black tracking-[3px] text-slate-400 mb-3">
              {section.title}
            </h3>

            <div className="bg-white rounded-3xl border overflow-hidden shadow-sm">
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveModal(item.id)}
                  className="w-full h-20 px-6 flex items-center justify-between border-b last:border-b-0 hover:bg-slate-50 duration-200"
                >
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{item.title}</span>
                      {item.badge && (
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                      )}
                    </div>
                    {item.subtitle && (
                      <p className="text-xs text-slate-400 mt-1">
                        {item.subtitle}
                      </p>
                    )}
                  </div>

                  <ChevronRight size={18} className="text-slate-400" />
                </button>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={() => setActiveModal("logout")}
          className="w-full h-14 bg-white border rounded-2xl font-black hover:bg-slate-50"
        >
          {currentText.logoutTitle}
        </button>
      </div>

      <PengaturanModal
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        currentText={currentText}
        chatSettings={chatSettings}
        setChatSettings={setChatSettings}
        notifSettings={notifSettings}
        setNotifSettings={setNotifSettings}
        privacySettings={privacySettings}
        setPrivacySettings={setPrivacySettings}
        language={language}
        setLanguage={setLanguage}
        languages={languages}
      />
    </>
  );
}

export default Pengaturan;
