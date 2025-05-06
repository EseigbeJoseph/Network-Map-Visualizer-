import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: {
                "Home": "Home",
                "Switch Interfaces": "Switch Interfaces",
                "Welcome Message": "Welcome to the Network Monitoring Tool",
                "Network Map": "Network Map",
                "Switch Details": "Switch Details",
            }
        },
        fr: {
            translation: {
                "Home": "Accueil",
                "Switch Interfaces": "Interfaces de commutateur",
                "Welcome Message": "Bienvenue dans l'outil de surveillance réseau",
                "Network Map": "Carte du Réseau",
                "Switch Details": "Détails du commutateur",
            }
        },
        es: {
            translation: {
                "Home": "Inicio",
                "Switch Interfaces": "Interfaces de conmutador",
                "Welcome Message": "Bienvenido a la herramienta de monitoreo de red",
                "Network Map": "Mapa de Red",
                "Switch Details": "Detalles del interruptor", 
            }
        },
        fi: {
            translation: {
                "Home": "Koti",
                "Switch Interfaces": "Kytkimen rajapinnat",
                "Switch Details": "Kytkimen tiedot",
                "Welcome Message": "Tervetuloa verkon valvontatyökaluun",
                "Network Map": "Verkkokartta",
            }
        }
    },
    lng: "en", // Default language
    fallbackLng: "en",
    interpolation: { escapeValue: false }
});

export default i18n;
