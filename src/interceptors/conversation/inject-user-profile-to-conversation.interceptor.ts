import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { from } from 'rxjs';
import { convertObject } from 'src/shared/mongoose/helpers';
import { Document2Interface } from 'src/shared/mongoose/types';
import _ from 'lodash';
import { mergeMap } from 'rxjs/operators';
import { ConversationDocument } from 'src/modules/conversations/conversations.model';
import { ProfileRepository } from 'src/modules/profile/profile.repository';
import { ProfileDocument } from 'src/modules/profile/profile.model';

@Injectable()
export class InjectProfileDataToConversationInterceptor
  implements NestInterceptor
{
  constructor(private readonly profileRepo: ProfileRepository) {}
  intercept(
    ctx: ExecutionContext,
    next: CallHandler<
      | Document2Interface<ConversationDocument>
      | Document2Interface<ConversationDocument>[]
    >,
  ) {
    if (ctx.switchToHttp().getRequest().query['includeProfileData'] !== 'true')
      return next.handle();
    return next
      .handle()
      .pipe(mergeMap((data) => from(this.injectData(convertObject(data)))));
  }

  async injectData(
    data:
      | Document2Interface<ConversationDocument>
      | Document2Interface<ConversationDocument>[],
  ) {
    const profileMappedById = await this.getProfilesMappedById(
      Array.isArray(data) ? data : [data],
    );
    if (Array.isArray(data)) {
      data.forEach((conv) => {
        conv.participants = this.addProfileDataToConversation(
          conv,
          profileMappedById,
        );
      });
    } else {
      data.participants = this.addProfileDataToConversation(
        data,
        profileMappedById,
      );
    }
    return data;
  }

  addProfileDataToConversation(
    conversation: Document2Interface<ConversationDocument>,
    profileMappedById: _.Dictionary<ProfileDocument>,
  ) {
    return conversation.participants.map((participant) => ({
      ...participant,
      displayName: profileMappedById[participant.profileId].displayName,
      logoUrl: profileMappedById[participant.profileId].logoUrl,
    }));
  }

  async getProfilesMappedById(
    conversations: Document2Interface<ConversationDocument>[],
  ) {
    const profileIds = _.uniq(
      _.flatten(
        conversations.map((conv) =>
          conv.participants.map((participant) => participant.profileId),
        ),
      ),
    );
    const profileData = await this.profileRepo.find({
      _id: { $in: profileIds },
    });
    return _.mapKeys(profileData, 'id');
  }
}
