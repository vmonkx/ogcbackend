import type { Attribute, Schema } from '@strapi/strapi';

export interface MainComponentsHero extends Schema.Component {
  collectionName: 'components_main_components_heroes';
  info: {
    description: '';
    displayName: 'hero';
    icon: 'archway';
  };
  attributes: {
    cover: Attribute.Media<'files' | 'images' | 'videos'> & Attribute.Required;
    info: Attribute.Text;
    title: Attribute.String;
  };
}

export interface MainComponentsMainAdvantage extends Schema.Component {
  collectionName: 'components_main_components_main_advantages';
  info: {
    description: '';
    displayName: 'MainAdvantage';
    icon: 'bars';
  };
  attributes: {
    content: Attribute.RichText;
    image: Attribute.Media<'images' | 'files' | 'videos'>;
    numbersAdvantage: Attribute.JSON;
    title: Attribute.String;
  };
}

export interface PersonalComponentsCertificates extends Schema.Component {
  collectionName: 'components_personal_components_certificates';
  info: {
    displayName: ' certificates';
    icon: 'bible';
  };
  attributes: {
    title: Attribute.Text;
  };
}

export interface PersonalComponentsCourses extends Schema.Component {
  collectionName: 'components_personal_components_courses';
  info: {
    displayName: 'courses';
    icon: 'closed-captioning';
  };
  attributes: {
    title: Attribute.Text;
  };
}

export interface PersonalComponentsRetraining extends Schema.Component {
  collectionName: 'components_personal_components_retrainings';
  info: {
    displayName: 'retraining';
    icon: 'address-book';
  };
  attributes: {
    title: Attribute.Text;
  };
}

export interface PersonalComponentsStateCertificate extends Schema.Component {
  collectionName: 'components_personal_components_state_certificates';
  info: {
    displayName: 'stateCertificate';
    icon: 'landmark';
  };
  attributes: {
    title: Attribute.Text;
  };
}

export interface ServiceComponentsAdvantage extends Schema.Component {
  collectionName: 'components_service_components_advantages';
  info: {
    displayName: 'Advantage';
    icon: 'child';
  };
  attributes: {
    image: Attribute.Media<'images' | 'files' | 'videos'>;
    listAdvantage: Attribute.Component<
      'service-components.list-advantage',
      true
    >;
    title: Attribute.String;
  };
}

export interface ServiceComponentsArticleService extends Schema.Component {
  collectionName: 'components_service_components_article_services';
  info: {
    description: '';
    displayName: 'ArticleService';
    icon: 'atlas';
  };
  attributes: {
    image: Attribute.Media<'images' | 'files' | 'videos'>;
    subtitle: Attribute.String;
    text: Attribute.RichText;
  };
}

export interface ServiceComponentsCompareItem extends Schema.Component {
  collectionName: 'components_service_components_compare_items';
  info: {
    description: '';
    displayName: 'CompareItem';
    icon: 'venus';
  };
  attributes: {
    after: Attribute.Media<'images' | 'files' | 'videos'>;
    before: Attribute.Media<'images' | 'files' | 'videos'>;
    description: Attribute.String;
  };
}

export interface ServiceComponentsCompareSection extends Schema.Component {
  collectionName: 'components_service_components_compare_sections';
  info: {
    displayName: 'CompareSection';
    icon: 'mars-double';
  };
  attributes: {
    CompareItem: Attribute.Component<'service-components.compare-item', true>;
    title: Attribute.String;
  };
}

export interface ServiceComponentsCoverColor extends Schema.Component {
  collectionName: 'components_service_components_cover_colors';
  info: {
    description: '';
    displayName: 'coverColor';
    icon: 'adjust';
  };
  attributes: {
    gradientEnd: Attribute.String &
      Attribute.DefaultTo<'rgba(182, 180, 193, 0)'>;
    gradientStart: Attribute.String &
      Attribute.DefaultTo<'rgba(182, 180, 193,1)'>;
    urlImage: Attribute.String & Attribute.Private;
  };
}

export interface ServiceComponentsListAdvantage extends Schema.Component {
  collectionName: 'components_service_components_list_advantages';
  info: {
    description: '';
    displayName: 'listAdvantage';
    icon: 'list-ol';
  };
  attributes: {
    text: Attribute.Text;
  };
}

export interface ServiceComponentsMeta extends Schema.Component {
  collectionName: 'components_service_components_metas';
  info: {
    displayName: 'meta';
    icon: 'ad';
  };
  attributes: {
    content: Attribute.Text;
    name: Attribute.String;
  };
}

export interface ServiceComponentsPriceItem extends Schema.Component {
  collectionName: 'components_service_components_price_items';
  info: {
    displayName: 'PriceItem';
    icon: 'dollar-sign';
  };
  attributes: {
    code: Attribute.String;
    description: Attribute.Text;
    duration: Attribute.String;
    name: Attribute.String;
    price: Attribute.String;
  };
}

export interface ServiceComponentsResultItem extends Schema.Component {
  collectionName: 'components_service_components_result_items';
  info: {
    displayName: 'ResultItem';
    icon: 'american-sign-language-interpreting';
  };
  attributes: {
    description: Attribute.Text;
    image: Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface ServiceComponentsResultsSection extends Schema.Component {
  collectionName: 'components_service_components_results_sections';
  info: {
    description: '';
    displayName: 'ResultsSection';
    icon: 'feather-alt';
  };
  attributes: {
    resultItem: Attribute.Component<'service-components.result-item', true>;
    title: Attribute.String;
  };
}

export interface ServiceComponentsSeo extends Schema.Component {
  collectionName: 'components_service_components_seos';
  info: {
    description: '';
    displayName: 'seo';
    icon: 'address-card';
  };
  attributes: {
    description: Attribute.Text;
    lang: Attribute.String & Attribute.DefaultTo<'ru'>;
    meta: Attribute.Component<'service-components.meta', true>;
    shareImage: Attribute.Media<'images' | 'files' | 'videos'>;
    title: Attribute.String;
  };
}

export interface ServiceComponentsServiceList extends Schema.Component {
  collectionName: 'components_service_components_service_lists';
  info: {
    description: '';
    displayName: 'serviceList';
    icon: 'list';
  };
  attributes: {};
}

export interface ServiceComponentsTitle extends Schema.Component {
  collectionName: 'components_service_components_titles';
  info: {
    displayName: 'title';
    icon: 'ad';
  };
  attributes: {
    text: Attribute.String;
  };
}

export interface ServiceComponentsVideoSection extends Schema.Component {
  collectionName: 'components_service_components_video_sections';
  info: {
    description: '';
    displayName: 'VideoSection';
    icon: 'film';
  };
  attributes: {
    description: Attribute.Text;
    title: Attribute.String;
    url: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'main-components.hero': MainComponentsHero;
      'main-components.main-advantage': MainComponentsMainAdvantage;
      'personal-components.certificates': PersonalComponentsCertificates;
      'personal-components.courses': PersonalComponentsCourses;
      'personal-components.retraining': PersonalComponentsRetraining;
      'personal-components.state-certificate': PersonalComponentsStateCertificate;
      'service-components.advantage': ServiceComponentsAdvantage;
      'service-components.article-service': ServiceComponentsArticleService;
      'service-components.compare-item': ServiceComponentsCompareItem;
      'service-components.compare-section': ServiceComponentsCompareSection;
      'service-components.cover-color': ServiceComponentsCoverColor;
      'service-components.list-advantage': ServiceComponentsListAdvantage;
      'service-components.meta': ServiceComponentsMeta;
      'service-components.price-item': ServiceComponentsPriceItem;
      'service-components.result-item': ServiceComponentsResultItem;
      'service-components.results-section': ServiceComponentsResultsSection;
      'service-components.seo': ServiceComponentsSeo;
      'service-components.service-list': ServiceComponentsServiceList;
      'service-components.title': ServiceComponentsTitle;
      'service-components.video-section': ServiceComponentsVideoSection;
    }
  }
}
