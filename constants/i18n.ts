import type { AppLanguage } from '@/types/language';

type UiKey =
  | 'home.heroTitle'
  | 'home.heroSub'
  | 'home.freeTales'
  | 'home.freeTalesSub'
  | 'home.moreLibrary'
  | 'home.comingSoon'
  | 'library.title'
  | 'library.sub'
  | 'library.premium'
  | 'library.scheduled'
  | 'profile.title'
  | 'profile.plan'
  | 'profile.premium'
  | 'profile.free'
  | 'profile.readsLeft'
  | 'profile.upgrade'
  | 'profile.aboutTitle'
  | 'profile.aboutBody'
  | 'profile.langTitle'
  | 'profile.langSub'
  | 'profile.storyLanguage'
  | 'profile.voiceLanguage'
  | 'profile.voiceSameAsStory'
  | 'profile.translationFallback'
  | 'narration.listen'
  | 'narration.stop'
  | 'narration.autoRead'
  | 'narration.hint'
  | 'reader.back'
  | 'reader.next'
  | 'reader.end'
  | 'reader.endSub'
  | 'reader.opening'
  | 'reader.fallbackBanner'
  | 'quota.premiumTitle'
  | 'quota.premiumSub'
  | 'quota.exhausted'
  | 'quota.remaining'
  | 'quota.upgrade'
  | 'card.illustrated'
  | 'card.new'
  | 'payment.chooseMethod'
  | 'payment.selectPlan'
  | 'payment.continue'
  | 'payment.processing'
  | 'payment.success'
  | 'payment.failed'
  | 'payment.pending'
  | 'payment.method.card'
  | 'payment.method.cardDesc'
  | 'payment.method.crypto'
  | 'payment.method.cryptoDesc'
  | 'payment.method.telegram'
  | 'payment.method.telegramDesc'
  | 'payment.crypto.title'
  | 'payment.crypto.pickChain'
  | 'payment.crypto.send'
  | 'payment.crypto.address'
  | 'payment.crypto.memo'
  | 'payment.crypto.waiting'
  | 'payment.crypto.copy'
  | 'payment.crypto.copyAddress'
  | 'payment.crypto.copied'
  | 'payment.crypto.chainNote'
  | 'payment.telegram.open'
  | 'payment.telegram.hint'
  | 'payment.card.redirect'
  | 'payment.poll'
  | 'payment.devSimulate';

const UI: Record<AppLanguage, Record<UiKey, string>> = {
  en: {
    'home.heroTitle': 'Fairytale Dreams',
    'home.heroSub': 'Fresh AI-crafted stories for curious little minds',
    'home.freeTales': "This week's free tales",
    'home.freeTalesSub': 'Two stories included — new ones arrive all the time',
    'home.moreLibrary': 'More in the library',
    'home.comingSoon': 'Coming soon',
    'library.title': 'Story library',
    'library.sub': 'tales available',
    'library.premium': 'Premium collection',
    'library.scheduled': 'Scheduled releases',
    'profile.title': 'Your family',
    'profile.plan': 'Plan',
    'profile.premium': 'Premium ✨',
    'profile.free': 'Free',
    'profile.readsLeft': 'free reads left · resets',
    'profile.upgrade': 'Unlock unlimited stories',
    'profile.aboutTitle': 'About Fairytale Dreams',
    'profile.aboutBody':
      'Stories are crafted by AI with child-safe themes, reviewed for tone, and added over time. We never show ads in stories.',
    'profile.langTitle': 'Languages',
    'profile.langSub': 'Choose reading language and narration voice separately',
    'profile.storyLanguage': 'Story text',
    'profile.voiceLanguage': 'Narration voice',
    'profile.voiceSameAsStory': 'Same as story text',
    'profile.translationFallback': 'This tale is not fully translated yet — showing English',
    'narration.listen': 'Listen',
    'narration.stop': 'Stop',
    'narration.autoRead': 'Auto-read',
    'narration.hint': 'Voice reads the story aloud',
    'reader.back': '← Back',
    'reader.next': 'Next page →',
    'reader.end': 'The end 🌟',
    'reader.endSub': 'Sweet dreams, little reader!',
    'reader.opening': 'Opening your story…',
    'reader.fallbackBanner': 'Showing English — translation coming soon',
    'quota.premiumTitle': '✨ Premium storyteller',
    'quota.premiumSub': 'Unlimited magical tales for your family',
    'quota.exhausted': 'Free stories used this week',
    'quota.remaining': 'free stories left',
    'quota.upgrade': 'Upgrade',
    'card.illustrated': 'Illustrated',
    'card.new': 'New',
    'payment.chooseMethod': 'Choose payment method',
    'payment.selectPlan': 'Choose your plan',
    'payment.continue': 'Continue to payment',
    'payment.processing': 'Processing…',
    'payment.success': 'Welcome to Premium!',
    'payment.failed': 'Payment failed',
    'payment.pending': 'Complete your payment',
    'payment.method.card': 'Card',
    'payment.method.cardDesc': 'Visa, Mastercard, Apple Pay',
    'payment.method.crypto': 'Crypto',
    'payment.method.cryptoDesc': 'ETH · TRC20 · BTC · TON · SOL',
    'payment.method.telegram': 'Telegram Stars',
    'payment.method.telegramDesc': 'Pay with ⭐ in Telegram',
    'payment.crypto.title': 'Send crypto',
    'payment.crypto.pickChain': 'Choose network',
    'payment.crypto.send': 'Send exactly',
    'payment.crypto.address': 'Wallet address',
    'payment.crypto.memo': 'Payment ID (required memo)',
    'payment.crypto.waiting': 'We will unlock Premium after on-chain confirmation.',
    'payment.crypto.copy': 'Tap to copy memo',
    'payment.crypto.copyAddress': 'Tap to copy address',
    'payment.crypto.copied': 'Copied!',
    'payment.crypto.chainNote':
      'Use the exact network shown. Wrong chain may lose funds.',
    'payment.telegram.open': 'Open Telegram payment',
    'payment.telegram.hint':
      'Pay with Stars in our Telegram bot or Mini App. Premium unlocks automatically.',
    'payment.card.redirect': 'You will be redirected to secure checkout.',
    'payment.poll': 'Checking payment status…',
    'payment.devSimulate': 'Simulate payment (dev)',
  },
  es: {
    'home.heroTitle': 'Sueños de Cuento',
    'home.heroSub': 'Cuentos nuevos creados con IA para mentes curiosas',
    'home.freeTales': 'Cuentos gratis de esta semana',
    'home.freeTalesSub': 'Dos cuentos incluidos — llegan nuevos todo el tiempo',
    'home.moreLibrary': 'Más en la biblioteca',
    'home.comingSoon': 'Próximamente',
    'library.title': 'Biblioteca',
    'library.sub': 'cuentos disponibles',
    'library.premium': 'Colección premium',
    'library.scheduled': 'Próximos estrenos',
    'profile.title': 'Tu familia',
    'profile.plan': 'Plan',
    'profile.premium': 'Premium ✨',
    'profile.free': 'Gratis',
    'profile.readsLeft': 'lecturas gratis · reinicia',
    'profile.upgrade': 'Desbloquear cuentos ilimitados',
    'profile.aboutTitle': 'Sobre Sueños de Cuento',
    'profile.aboutBody':
      'Cuentos creados con IA, seguros para niños y revisados en tono. Sin anuncios en las historias.',
    'profile.langTitle': 'Idiomas',
    'profile.langSub': 'Elige idioma del texto y de la voz por separado',
    'profile.storyLanguage': 'Texto del cuento',
    'profile.voiceLanguage': 'Voz narrada',
    'profile.voiceSameAsStory': 'Igual que el texto',
    'profile.translationFallback': 'Este cuento aún no está traducido — en inglés',
    'narration.listen': 'Escuchar',
    'narration.stop': 'Parar',
    'narration.autoRead': 'Auto-leer',
    'narration.hint': 'La voz lee el cuento en voz alta',
    'reader.back': '← Volver',
    'reader.next': 'Siguiente →',
    'reader.end': 'Fin 🌟',
    'reader.endSub': '¡Dulces sueños, pequeño lector!',
    'reader.opening': 'Abriendo tu cuento…',
    'reader.fallbackBanner': 'En inglés — traducción pronto',
    'quota.premiumTitle': '✨ Narrador premium',
    'quota.premiumSub': 'Cuentos mágicos ilimitados',
    'quota.exhausted': 'Cuentos gratis usados esta semana',
    'quota.remaining': 'cuentos gratis restantes',
    'quota.upgrade': 'Mejorar',
    'card.illustrated': 'Ilustrado',
    'card.new': 'Nuevo',
  },
  fr: {
    'home.heroTitle': 'Rêves de Contes',
    'home.heroSub': 'Des histoires IA pour les petits curieux',
    'home.freeTales': 'Contes gratuits cette semaine',
    'home.freeTalesSub': 'Deux contes inclus — de nouveaux arrivent souvent',
    'home.moreLibrary': 'Plus dans la bibliothèque',
    'home.comingSoon': 'Bientôt',
    'library.title': 'Bibliothèque',
    'library.sub': 'contes disponibles',
    'library.premium': 'Collection premium',
    'library.scheduled': 'Prochainement',
    'profile.title': 'Votre famille',
    'profile.plan': 'Forfait',
    'profile.premium': 'Premium ✨',
    'profile.free': 'Gratuit',
    'profile.readsLeft': 'lectures gratuites · reset',
    'profile.upgrade': 'Histoires illimitées',
    'profile.aboutTitle': 'À propos',
    'profile.aboutBody':
      'Histoires IA sûres pour enfants, sans publicité dans les contes.',
    'profile.langTitle': 'Langues',
    'profile.langSub': 'Texte et voix peuvent être différents',
    'profile.storyLanguage': 'Texte du conte',
    'profile.voiceLanguage': 'Voix de lecture',
    'profile.voiceSameAsStory': 'Comme le texte',
    'profile.translationFallback': 'Pas encore traduit — en anglais',
    'narration.listen': 'Écouter',
    'narration.stop': 'Stop',
    'narration.autoRead': 'Lecture auto',
    'narration.hint': 'Voix haute pour le conte',
    'reader.back': '← Retour',
    'reader.next': 'Page suivante →',
    'reader.end': 'Fin 🌟',
    'reader.endSub': 'Bonne nuit, petit lecteur !',
    'reader.opening': 'Ouverture…',
    'reader.fallbackBanner': 'En anglais — traduction bientôt',
    'quota.premiumTitle': '✨ Premium',
    'quota.premiumSub': 'Contes illimités',
    'quota.exhausted': 'Gratuits épuisés cette semaine',
    'quota.remaining': 'contes gratuits restants',
    'quota.upgrade': 'Améliorer',
    'card.illustrated': 'Illustré',
    'card.new': 'Nouveau',
  },
  de: {
    'home.heroTitle': 'Märchenträume',
    'home.heroSub': 'KI-Geschichten für neugierige Kinder',
    'home.freeTales': 'Gratis-Märchen diese Woche',
    'home.freeTalesSub': 'Zwei Geschichten — immer neue',
    'home.moreLibrary': 'Mehr in der Bibliothek',
    'home.comingSoon': 'Demnächst',
    'library.title': 'Bibliothek',
    'library.sub': 'Geschichten verfügbar',
    'library.premium': 'Premium-Sammlung',
    'library.scheduled': 'Geplant',
    'profile.title': 'Eure Familie',
    'profile.plan': 'Plan',
    'profile.premium': 'Premium ✨',
    'profile.free': 'Kostenlos',
    'profile.readsLeft': 'Gratis-Lesungen · Reset',
    'profile.upgrade': 'Unbegrenzte Geschichten',
    'profile.aboutTitle': 'Über Märchenträume',
    'profile.aboutBody': 'KI-Geschichten, kindersicher, ohne Werbung.',
    'profile.langTitle': 'Sprachen',
    'profile.langSub': 'Text und Stimme getrennt wählen',
    'profile.storyLanguage': 'Geschichtentext',
    'profile.voiceLanguage': 'Erzählstimme',
    'profile.voiceSameAsStory': 'Wie der Text',
    'profile.translationFallback': 'Noch nicht übersetzt — Englisch',
    'narration.listen': 'Anhören',
    'narration.stop': 'Stopp',
    'narration.autoRead': 'Auto-Lesen',
    'narration.hint': 'Stimme liest vor',
    'reader.back': '← Zurück',
    'reader.next': 'Weiter →',
    'reader.end': 'Ende 🌟',
    'reader.endSub': 'Süße Träume!',
    'reader.opening': 'Geschichte öffnet…',
    'reader.fallbackBanner': 'Englisch — Übersetzung folgt',
    'quota.premiumTitle': '✨ Premium',
    'quota.premiumSub': 'Unbegrenzt lesen',
    'quota.exhausted': 'Gratis aufgebraucht',
    'quota.remaining': 'Gratis übrig',
    'quota.upgrade': 'Upgrade',
    'card.illustrated': 'Illustriert',
    'card.new': 'Neu',
  },
  pt: {
    'home.heroTitle': 'Sonhos de Conto',
    'home.heroSub': 'Histórias com IA para mentes curiosas',
    'home.freeTales': 'Contos grátis esta semana',
    'home.freeTalesSub': 'Dois contos — novos chegam sempre',
    'home.moreLibrary': 'Mais na biblioteca',
    'home.comingSoon': 'Em breve',
    'library.title': 'Biblioteca',
    'library.sub': 'contos disponíveis',
    'library.premium': 'Coleção premium',
    'library.scheduled': 'Em breve',
    'profile.title': 'Sua família',
    'profile.plan': 'Plano',
    'profile.premium': 'Premium ✨',
    'profile.free': 'Grátis',
    'profile.readsLeft': 'leituras grátis · reinicia',
    'profile.upgrade': 'Contos ilimitados',
    'profile.aboutTitle': 'Sobre o app',
    'profile.aboutBody': 'Histórias IA seguras, sem anúncios nos contos.',
    'profile.langTitle': 'Idiomas',
    'profile.langSub': 'Texto e voz separados',
    'profile.storyLanguage': 'Texto do conto',
    'profile.voiceLanguage': 'Voz narrada',
    'profile.voiceSameAsStory': 'Igual ao texto',
    'profile.translationFallback': 'Ainda em inglês',
    'narration.listen': 'Ouvir',
    'narration.stop': 'Parar',
    'narration.autoRead': 'Auto-ler',
    'narration.hint': 'Voz lê em alto',
    'reader.back': '← Voltar',
    'reader.next': 'Próxima →',
    'reader.end': 'Fim 🌟',
    'reader.endSub': 'Bons sonhos!',
    'reader.opening': 'Abrindo…',
    'reader.fallbackBanner': 'Em inglês — tradução em breve',
    'quota.premiumTitle': '✨ Premium',
    'quota.premiumSub': 'Contos ilimitados',
    'quota.exhausted': 'Grátis esgotados',
    'quota.remaining': 'grátis restantes',
    'quota.upgrade': 'Assinar',
    'card.illustrated': 'Ilustrado',
    'card.new': 'Novo',
  },
  ru: {
    'home.heroTitle': 'Сказочные Сны',
    'home.heroSub': 'Новые сказки от ИИ для любознательных детей',
    'home.freeTales': 'Бесплатные сказки этой недели',
    'home.freeTalesSub': 'Две сказки — новые появляются снова',
    'home.moreLibrary': 'Ещё в библиотеке',
    'home.comingSoon': 'Скоро',
    'library.title': 'Библиотека',
    'library.sub': 'сказок доступно',
    'library.premium': 'Премиум коллекция',
    'library.scheduled': 'Скоро в каталоге',
    'profile.title': 'Ваша семья',
    'profile.plan': 'План',
    'profile.premium': 'Премиум ✨',
    'profile.free': 'Бесплатно',
    'profile.readsLeft': 'бесплатных чтений · обновление',
    'profile.upgrade': 'Открыть все сказки',
    'profile.aboutTitle': 'О Сказочных Снах',
    'profile.aboutBody':
      'Сказки от ИИ, безопасные для детей, без рекламы в тексте.',
    'profile.langTitle': 'Языки',
    'profile.langSub': 'Отдельно текст сказки и голос рассказчика',
    'profile.storyLanguage': 'Текст сказки',
    'profile.voiceLanguage': 'Голос рассказчика',
    'profile.voiceSameAsStory': 'Как текст сказки',
    'profile.translationFallback': 'Перевода пока нет — на английском',
    'narration.listen': 'Слушать',
    'narration.stop': 'Стоп',
    'narration.autoRead': 'Авточтение',
    'narration.hint': 'Голос читает сказку вслух',
    'reader.back': '← Назад',
    'reader.next': 'Далее →',
    'reader.end': 'Конец 🌟',
    'reader.endSub': 'Сладких снов, маленький читатель!',
    'reader.opening': 'Открываем сказку…',
    'reader.fallbackBanner': 'На английском — перевод скоро',
    'quota.premiumTitle': '✨ Премиум',
    'quota.premiumSub': 'Безлимитные сказки',
    'quota.exhausted': 'Бесплатные закончились',
    'quota.remaining': 'бесплатных осталось',
    'quota.upgrade': 'Премиум',
    'card.illustrated': 'С иллюстрациями',
    'card.new': 'Новое',
  },
};

export function t(lang: AppLanguage, key: UiKey): string {
  return UI[lang][key] ?? UI.en[key];
}

export type { UiKey };
