function settingsAlert() {
  document.getElementById("failSave").classList.remove("result");
  document.getElementById("sucessfullSave").classList.remove("result");
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('settings');
  
  const applyTheme = () => {
    const selectedTheme = localStorage.getItem('theme-color');
    const themes = {
      'auto': {
        '--background-color': 'var(--background)',
        '--text-color': 'var(--text)',
        '--subtitle-color': 'var(--subtitle)',
        '--project-color': 'var(--project)',
        '--mcBackground': 'var(--bgMc)',
        '--html-color-scheme': 'var(--color-scheme)',
        'meta-theme-color': getComputedStyle(document.documentElement).getPropertyValue('--background') === '#121212' ? '#121212' : '#f1f1f1'
      },
      'light': {
        '--background-color': 'var(--bg-light)',
        '--text-color': 'var(--text-light)',
        '--subtitle-color': 'var(--subtitle-light)',
        '--project-color': 'var(--project-light)',
        '--mcBackground': 'var(--bgMc-light)',
        '--html-color-scheme': 'var(--color-scheme-light)',
        'meta-theme-color': '#f1f1f1'
      },
      'dark': {
        '--background-color': 'var(--bg-dark)',
        '--text-color': 'var(--text-dark)',
        '--subtitle-color': 'var(--subtitle-dark)',
        '--project-color': 'var(--project-dark)',
        '--mcBackground': 'var(--bgMc-dark)',
        '--html-color-scheme': 'var(--color-scheme-dark)',
        'meta-theme-color': '#121212'
      }
    };
    const theme = themes[selectedTheme] || themes['auto'];
    for (const [property, value] of Object.entries(theme)) {
      if (property === 'meta-theme-color') {
        document.querySelector('meta[name="theme-color"]').setAttribute('content', value);
      } else {
        document.documentElement.style.setProperty(property, value);
      }
    }
  };

  const setDarkerAccentColor = (color) => {
    const colors = {
      "151, 10, 10": "30, 0, 0",
      "10, 151, 33": "0, 30, 3",
      "10, 66, 151": "0, 10, 40",
      "151, 78, 10": "60, 18, 0"
    };
    const darkerColor = colors[color] || "18, 2, 24";
    document.documentElement.style.setProperty('--darker-accent-color', darkerColor);
    localStorage.setItem('darker-accent-color', darkerColor);

    if (!colors[color]) {
      const defaultAccentColor = "113, 10, 151";
      document.documentElement.style.setProperty('--accent-color', defaultAccentColor);
      localStorage.setItem('accent-color', defaultAccentColor);
    }
  };

  const toggleClass = (selector, className, condition) => {
    document.querySelectorAll(selector).forEach(element => {
      element.classList.toggle(className, condition);
    });
  };

  const applySettings = () => {
    const storedColor = localStorage.getItem('accent-color');
    if (storedColor) {
      document.documentElement.style.setProperty('--accent-color', storedColor);
      setDarkerAccentColor(storedColor);
    } else {
      setDarkerAccentColor(null);
    }

    const isUppercase = localStorage.getItem('uppercase') === 'true';
    toggleClass('p, a, h1, h2, h3, button, span, div, select, option', 'uppercaseText', isUppercase);

    const showAnimations = localStorage.getItem('showAnimations') !== 'false';
    toggleClass('*', 'noAnimation', !showAnimations);
  };

  const initializeForm = () => {
    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      try {
        document.getElementById("failSave").classList.remove("result");

        const theme = form.elements['theme-color'].value;
        localStorage.setItem('theme-color', theme);
        applyTheme();

        const accentColor = form.elements['accent-color'].value;
        localStorage.setItem('accent-color', accentColor);
        document.documentElement.style.setProperty('--accent-color', accentColor);

        const isUppercase = form.elements['uppercase'].checked;
        localStorage.setItem('uppercase', isUppercase);
        toggleClass('p, a, h1, h2, h3, button, span, div, select, option', 'uppercaseText', isUppercase);

        const showAnimations = form.elements['animations'].checked;
        localStorage.setItem('showAnimations', showAnimations);
        toggleClass('*', 'noAnimation', !showAnimations);

        document.getElementById("sucessfullSave").classList.add("result");
      } catch (error) {
        document.getElementById("failSave").classList.add("result");
        console.error("Failed to save settings:", error);
      }
    });

    const storedTheme = localStorage.getItem('theme-color');
    if (storedTheme) form.elements['theme-color'].value = storedTheme;

    const storedAccentColor = localStorage.getItem('accent-color');
    if (storedAccentColor) form.elements['accent-color'].value = storedAccentColor;

    const isUppercase = localStorage.getItem('uppercase') === 'true';
    form.elements['uppercase'].checked = isUppercase;

    const showAnimations = localStorage.getItem('showAnimations') !== 'false';
    form.elements['animations'].checked = showAnimations;
  };

  const handleLanguageChange = () => {
    const languageSelect = document.getElementById('language-select');
    const currentUrl = window.location.href;
    
    if (!form || !languageSelect) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const selectedLanguage = languageSelect.value;
      const redirectUrl = selectedLanguage === 'sv' && !currentUrl.includes('/sv/') ? 'sv/settings' :
        selectedLanguage === 'en' && currentUrl.includes('/sv/') ? '../settings' : '';

      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    });
  };

  applySettings();
  applyTheme();
  initializeForm();
  handleLanguageChange();
});
