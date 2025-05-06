import React from "react";
import { useTranslation } from "react-i18next";

const Navbar = ({ title }) => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang); // This should work as long as `i18n` is initialized properly
    };

    return (
        <div className="mini-navbar">
            <div className="page-title">{t(title)}</div>
            <select 
                className="language-switcher" 
                onChange={(e) => changeLanguage(e.target.value)} 
                value={i18n.language} // This ensures the correct language is selected
            >
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
                <option value="fi">Suomi</option>
            </select>
        </div>
    );
};

export default Navbar;
