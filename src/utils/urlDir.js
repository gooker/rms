function getProConfig() {
  if (window.extraConfig != null) {
    return window.extraConfig;
  }
  return {
    // dev
    sso: 'https://sso-api-dev.mushiny.com',
    translation: 'https://translation-api-dev.mushiny.com/',

    // 12
    // sso: 'http://sso-api-ntdev-self-defining.mushiny.local',
    // translation: 'http://translation-api-ntdev-self-defining.mushiny.local',
  };
}

export default getProConfig;
