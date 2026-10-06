import { StrapiMediaLib, StrapiUploadAdapter, getPluginPresets } from '@_sh/strapi-plugin-ckeditor';
import { MediaEmbed, HtmlEmbed, GeneralHtmlSupport } from 'ckeditor5';
import SyncPricesButton from './components/SyncPricesButton';

const config = {
  locales: [
    // 'ar',
    // 'fr',
    // 'cs',
    // 'de',
    // 'dk',
    // 'es',
    // 'he',
    // 'id',
    // 'it',
    // 'ja',
    // 'ko',
    // 'ms',
    // 'nl',
    // 'no',
    // 'pl',
    // 'pt-BR',
    // 'pt',
    // 'ru',
    // 'sk',
    // 'sv',
    // 'th',
    // 'tr',
    // 'uk',
    // 'vi',
    // 'zh-Hans',
    // 'zh',
  ],
};

const register = (app) => {
  // CKEditor defaultHtml preset has all plugins enabled out of the box
};

const bootstrap = (app) => {
  console.log(app);
  
  const contentManager = app.getPlugin('content-manager');
  if (contentManager) {
    contentManager.injectComponent('listView', 'actions', {
      name: 'SyncPricesButton',
      Component: SyncPricesButton,
    });
  }
};

export default {
  config,
  register,
  bootstrap,
};
