import { Prop, Schema } from '@nestjs/mongoose';
import {
  BaseDocument,
  EmbeddedDocument,
} from 'src/shared/mongoose/base.document';
import { DefaultSchemaOptions } from 'src/shared/mongoose/schema-option';
import { EAppGlobalType, EFeatureRolloutMode } from './types';

@Schema({ _id: false })
export class FeatureFlagModeDocument extends EmbeddedDocument {
  @Prop({ enum: EFeatureRolloutMode, type: String })
  rolloutMode?: EFeatureRolloutMode;
}

@Schema({ _id: false })
export class VersionDocument extends EmbeddedDocument {
  @Prop({ required: true, default: '1.0.0' })
  minimumSupportedVersion: string;

  @Prop({ required: true, default: '1.0.0' })
  latestAppVersion: string;
}

@Schema(DefaultSchemaOptions)
export class AppGlobalDocument extends BaseDocument {
  @Prop({ type: Map, of: FeatureFlagModeDocument.schema })
  featureFlags?: Map<string, FeatureFlagModeDocument>;

  @Prop({ type: VersionDocument, default: null })
  android?: VersionDocument;

  @Prop({ type: VersionDocument, default: null })
  ios?: VersionDocument;

  @Prop({ required: true })
  type: EAppGlobalType;
}
