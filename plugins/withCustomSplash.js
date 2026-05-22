/**
 * Re-applies the custom splash screen (styles.xml edits, colors, drawables)
 * on every `expo prebuild`. Source assets live under plugins/splash-assets/
 *
 * Layout expected:
 *   plugins/splash-assets/drawable/splash.xml
 *   plugins/splash-assets/<density>/splash_icon.png
 *   plugins/splash-assets/<density>/splash_screen.png
 *
 * Register in app.json:
 *   "plugins": ["./plugins/withCustomSplash"]
 */

const {
  withAndroidColors,
  withAndroidStyles,
  withDangerousMod,
} = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = 'plugins/splash-assets';
const DENSITIES = ['hdpi', 'mdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi'];
const PNG_FILES = ['splash_icon.png', 'splash_screen.png'];

const CUSTOM_COLORS = {
  splashscreen_background: '#1B232A',
  iconBackground: '#1A232A',
  colorPrimary: '#023c69',
  colorPrimaryDark: '#ffffff',
};

const APP_THEME_ITEMS = {
  'android:windowBackground': '@drawable/splash',
};

const SPLASH_THEME_ITEMS = {
  windowSplashScreenAnimatedIcon: '@drawable/splash_icon',
};

function upsertItem(style, name, value) {
  style.item = style.item ?? [];
  const idx = style.item.findIndex((i) => i.$.name === name);
  const entry = { $: { name }, _: value };
  if (idx >= 0) style.item[idx] = entry;
  else style.item.push(entry);
}

function withCustomSplashColors(config) {
  return withAndroidColors(config, (mod) => {
    const colors = mod.modResults.resources.color ?? [];
    for (const [name, value] of Object.entries(CUSTOM_COLORS)) {
      const existing = colors.find((c) => c.$.name === name);
      if (existing) existing._ = value;
      else colors.push({ $: { name }, _: value });
    }
    mod.modResults.resources.color = colors;
    return mod;
  });
}

function withCustomSplashStyles(config) {
  return withAndroidStyles(config, (mod) => {
    const styles = mod.modResults.resources.style ?? [];

    const appTheme = styles.find((s) => s.$.name === 'AppTheme');
    if (appTheme) {
      for (const [name, value] of Object.entries(APP_THEME_ITEMS)) {
        upsertItem(appTheme, name, value);
      }
    }

    const splashTheme = styles.find(
      (s) => s.$.name === 'Theme.App.SplashScreen',
    );
    if (splashTheme) {
      for (const [name, value] of Object.entries(SPLASH_THEME_ITEMS)) {
        upsertItem(splashTheme, name, value);
      }
    }

    return mod;
  });
}

function withCustomSplashAssets(config) {
  return withDangerousMod(config, [
    'android',
    async (mod) => {
      const { projectRoot, platformProjectRoot } = mod.modRequest;
      const resDir = path.join(platformProjectRoot, 'app/src/main/res');
      const sourceRoot = path.join(projectRoot, ASSETS_DIR);

      const splashXmlSrc = path.join(sourceRoot, 'drawable', 'splash.xml');
      const splashXmlDest = path.join(resDir, 'drawable', 'splash.xml');
      fs.mkdirSync(path.dirname(splashXmlDest), { recursive: true });
      fs.copyFileSync(splashXmlSrc, splashXmlDest);

      for (const density of DENSITIES) {
        const destDir = path.join(resDir, `drawable-${density}`);
        fs.mkdirSync(destDir, { recursive: true });
        for (const file of PNG_FILES) {
          fs.copyFileSync(
            path.join(sourceRoot, density, file),
            path.join(destDir, file),
          );
        }
      }

      return mod;
    },
  ]);
}

module.exports = function withCustomSplash(config) {
  config = withCustomSplashColors(config);
  config = withCustomSplashStyles(config);
  config = withCustomSplashAssets(config);
  return config;
};
