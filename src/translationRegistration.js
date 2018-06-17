import { config } from 'd2/lib/d2';

[
  'app',
  'home',
  'process',
  'organization',
  'list',
  'invite',
].forEach(key => config.i18n.strings.add(key));
