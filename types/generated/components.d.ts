import type { Schema, Struct } from '@strapi/strapi';

export interface MainComponentsHero extends Struct.ComponentSchema {
  collectionName: 'components_main_components_heroes';
  info: {
    description: '';
    displayName: 'hero';
    icon: 'archway';
  };
  attributes: {
    cover: Schema.Attribute.Media<'files' | 'images' | 'videos'> &
      Schema.Attribute.Required;
    info: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface MainComponentsMainAdvantage extends Struct.ComponentSchema {
  collectionName: 'components_main_components_main_advantages';
  info: {
    description: '';
    displayName: 'MainAdvantage';
    icon: 'bars';
  };
  attributes: {
    content: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
    numbersAdvantage: Schema.Attribute.JSON;
    title: Schema.Attribute.String;
  };
}

export interface MobileBlocksAlertBlock extends Struct.ComponentSchema {
  collectionName: 'components_mobile_blocks_alert_blocks';
  info: {
    displayName: 'Alert Block';
    icon: 'doctor';
  };
  attributes: {
    listItem: Schema.Attribute.Component<'mobile-blocks.list-item', true>;
    title: Schema.Attribute.String;
  };
}

export interface MobileBlocksBulletCards extends Struct.ComponentSchema {
  collectionName: 'components_mobile_blocks_bullet_cards';
  info: {
    displayName: 'Bullet Cards';
    icon: 'dashboard';
  };
  attributes: {
    cardItem: Schema.Attribute.Component<'mobile-blocks.card-item', true>;
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface MobileBlocksCardItem extends Struct.ComponentSchema {
  collectionName: 'components_mobile_blocks_card_items';
  info: {
    displayName: 'Card Item';
    icon: 'chartBubble';
  };
  attributes: {
    boldText: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    icons: Schema.Attribute.Enumeration<
      [
        'moisture',
        'clock',
        'acne_skin',
        'dry_skin',
        'dumbbell',
        'face_countur',
        'measuring_tape',
        'beach_umbrella',
        'eye_open',
        'calendar_repeat',
        'butt_lift_light',
        'facelifting',
        'sparkless',
        'runner',
        'meditation',
        'smooth_skin',
        'exp_doctor',
        'face_injections',
        'lips',
        'symmetry',
        'check_fillers',
        'dna',
      ]
    >;
  };
}

export interface MobileBlocksFactItem extends Struct.ComponentSchema {
  collectionName: 'components_mobile_blocks_fact_items';
  info: {
    displayName: 'Fact Item';
    icon: 'check';
  };
  attributes: {
    icons: Schema.Attribute.Enumeration<
      [
        'moisture',
        'clock',
        'acne_skin',
        'dry_skin',
        'dumbbell',
        'face_countur',
        'measuring_tape',
        'beach_umbrella',
        'eye_open',
        'calendar_repeat',
        'butt_lift_light',
        'facelifting',
        'sparkless',
        'runner',
        'meditation',
        'smooth_skin',
        'exp_doctor',
        'face_injections',
        'lips',
        'symmetry',
        'check_fillers',
        'dna',
      ]
    >;
    label: Schema.Attribute.String;
    value: Schema.Attribute.String;
  };
}

export interface MobileBlocksListItem extends Struct.ComponentSchema {
  collectionName: 'components_mobile_blocks_list_items';
  info: {
    displayName: 'List Item';
    icon: 'apps';
  };
  attributes: {
    text: Schema.Attribute.Text;
  };
}

export interface MobileBlocksQuickFacts extends Struct.ComponentSchema {
  collectionName: 'components_mobile_blocks_quick_facts';
  info: {
    displayName: 'Quick Facts';
    icon: 'apps';
  };
  attributes: {
    factItem: Schema.Attribute.Component<'mobile-blocks.fact-item', true>;
  };
}

export interface MobileBlocksTimelineBlock extends Struct.ComponentSchema {
  collectionName: 'components_mobile_blocks_timeline_blocks';
  info: {
    displayName: 'Timeline Block';
    icon: 'clock';
  };
  attributes: {
    timelineStep: Schema.Attribute.Component<
      'mobile-blocks.timeline-step',
      true
    >;
    title: Schema.Attribute.String;
  };
}

export interface MobileBlocksTimelineStep extends Struct.ComponentSchema {
  collectionName: 'components_mobile_blocks_timeline_steps';
  info: {
    displayName: 'Timeline Step';
    icon: 'bulletList';
  };
  attributes: {
    description: Schema.Attribute.Text;
    period: Schema.Attribute.String;
  };
}

export interface PersonalComponentsCertificates extends Struct.ComponentSchema {
  collectionName: 'components_personal_components_certificates';
  info: {
    displayName: ' certificates';
    icon: 'bible';
  };
  attributes: {
    title: Schema.Attribute.Text;
  };
}

export interface PersonalComponentsCourses extends Struct.ComponentSchema {
  collectionName: 'components_personal_components_courses';
  info: {
    displayName: 'courses';
    icon: 'closed-captioning';
  };
  attributes: {
    title: Schema.Attribute.Text;
  };
}

export interface PersonalComponentsRetraining extends Struct.ComponentSchema {
  collectionName: 'components_personal_components_retrainings';
  info: {
    displayName: 'retraining';
    icon: 'address-book';
  };
  attributes: {
    title: Schema.Attribute.Text;
  };
}

export interface PersonalComponentsStateCertificate
  extends Struct.ComponentSchema {
  collectionName: 'components_personal_components_state_certificates';
  info: {
    displayName: 'stateCertificate';
    icon: 'landmark';
  };
  attributes: {
    title: Schema.Attribute.Text;
  };
}

export interface PersonalComponentsStatistics extends Struct.ComponentSchema {
  collectionName: 'components_personal_components_statistics';
  info: {
    description: 'Statistics or achievements for personal';
    displayName: 'Statistics';
    icon: 'chart-pie';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ServiceComponentsAdvantage extends Struct.ComponentSchema {
  collectionName: 'components_service_components_advantages';
  info: {
    displayName: 'Advantage';
    icon: 'child';
  };
  attributes: {
    image: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
    listAdvantage: Schema.Attribute.Component<
      'service-components.list-advantage',
      true
    >;
    title: Schema.Attribute.String;
  };
}

export interface ServiceComponentsArticleService
  extends Struct.ComponentSchema {
  collectionName: 'components_service_components_article_services';
  info: {
    description: '';
    displayName: 'ArticleService';
    icon: 'atlas';
  };
  attributes: {
    image: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
    subtitle: Schema.Attribute.String;
    text: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
  };
}

export interface ServiceComponentsCompareItem extends Struct.ComponentSchema {
  collectionName: 'components_service_components_compare_items';
  info: {
    description: '';
    displayName: 'CompareItem';
    icon: 'venus';
  };
  attributes: {
    after: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
    before: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
    description: Schema.Attribute.String;
  };
}

export interface ServiceComponentsCompareSection
  extends Struct.ComponentSchema {
  collectionName: 'components_service_components_compare_sections';
  info: {
    displayName: 'CompareSection';
    icon: 'mars-double';
  };
  attributes: {
    CompareItem: Schema.Attribute.Component<
      'service-components.compare-item',
      true
    >;
    title: Schema.Attribute.String;
  };
}

export interface ServiceComponentsCoverColor extends Struct.ComponentSchema {
  collectionName: 'components_service_components_cover_colors';
  info: {
    description: '';
    displayName: 'coverColor';
    icon: 'adjust';
  };
  attributes: {
    gradientEnd: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'rgba(182, 180, 193, 0)'>;
    gradientStart: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'rgba(182, 180, 193,1)'>;
    urlImage: Schema.Attribute.String & Schema.Attribute.Private;
  };
}

export interface ServiceComponentsListAdvantage extends Struct.ComponentSchema {
  collectionName: 'components_service_components_list_advantages';
  info: {
    description: '';
    displayName: 'listAdvantage';
    icon: 'list-ol';
  };
  attributes: {
    text: Schema.Attribute.Text;
  };
}

export interface ServiceComponentsMeta extends Struct.ComponentSchema {
  collectionName: 'components_service_components_metas';
  info: {
    displayName: 'meta';
    icon: 'ad';
  };
  attributes: {
    content: Schema.Attribute.Text;
    name: Schema.Attribute.String;
  };
}

export interface ServiceComponentsPriceItem extends Struct.ComponentSchema {
  collectionName: 'components_service_components_price_items';
  info: {
    displayName: 'PriceItem';
    icon: 'dollar-sign';
  };
  attributes: {
    code: Schema.Attribute.String;
    description: Schema.Attribute.Text;
    duration: Schema.Attribute.String;
    name: Schema.Attribute.String;
    price: Schema.Attribute.String;
  };
}

export interface ServiceComponentsResultItem extends Struct.ComponentSchema {
  collectionName: 'components_service_components_result_items';
  info: {
    displayName: 'ResultItem';
    icon: 'american-sign-language-interpreting';
  };
  attributes: {
    description: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface ServiceComponentsResultsSection
  extends Struct.ComponentSchema {
  collectionName: 'components_service_components_results_sections';
  info: {
    description: '';
    displayName: 'ResultsSection';
    icon: 'feather-alt';
  };
  attributes: {
    resultItem: Schema.Attribute.Component<
      'service-components.result-item',
      true
    >;
    title: Schema.Attribute.String;
  };
}

export interface ServiceComponentsSeo extends Struct.ComponentSchema {
  collectionName: 'components_service_components_seos';
  info: {
    description: '';
    displayName: 'seo';
    icon: 'address-card';
  };
  attributes: {
    description: Schema.Attribute.Text;
    lang: Schema.Attribute.String & Schema.Attribute.DefaultTo<'ru'>;
    meta: Schema.Attribute.Component<'service-components.meta', true>;
    shareImage: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
    title: Schema.Attribute.String;
  };
}

export interface ServiceComponentsServiceList extends Struct.ComponentSchema {
  collectionName: 'components_service_components_service_lists';
  info: {
    description: '';
    displayName: 'serviceList';
    icon: 'list';
  };
  attributes: {};
}

export interface ServiceComponentsTitle extends Struct.ComponentSchema {
  collectionName: 'components_service_components_titles';
  info: {
    displayName: 'title';
    icon: 'ad';
  };
  attributes: {
    text: Schema.Attribute.String;
  };
}

export interface ServiceComponentsVideoSection extends Struct.ComponentSchema {
  collectionName: 'components_service_components_video_sections';
  info: {
    description: '';
    displayName: 'VideoSection';
    icon: 'film';
  };
  attributes: {
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'main-components.hero': MainComponentsHero;
      'main-components.main-advantage': MainComponentsMainAdvantage;
      'mobile-blocks.alert-block': MobileBlocksAlertBlock;
      'mobile-blocks.bullet-cards': MobileBlocksBulletCards;
      'mobile-blocks.card-item': MobileBlocksCardItem;
      'mobile-blocks.fact-item': MobileBlocksFactItem;
      'mobile-blocks.list-item': MobileBlocksListItem;
      'mobile-blocks.quick-facts': MobileBlocksQuickFacts;
      'mobile-blocks.timeline-block': MobileBlocksTimelineBlock;
      'mobile-blocks.timeline-step': MobileBlocksTimelineStep;
      'personal-components.certificates': PersonalComponentsCertificates;
      'personal-components.courses': PersonalComponentsCourses;
      'personal-components.retraining': PersonalComponentsRetraining;
      'personal-components.state-certificate': PersonalComponentsStateCertificate;
      'personal-components.statistics': PersonalComponentsStatistics;
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
