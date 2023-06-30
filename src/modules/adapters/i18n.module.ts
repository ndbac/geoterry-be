import { Module } from '@nestjs/common';
import { HeaderResolver, I18nJsonParser, I18nModule } from 'nestjs-i18n';
import path from 'path';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      parser: I18nJsonParser,
      parserOptions: {
        path: path.join(process.cwd(), '/i18n/'),
      },
      resolvers: [new HeaderResolver(['Accept-Language'])],
    }),
  ],
})
export class GeoterryI18nModule {}
