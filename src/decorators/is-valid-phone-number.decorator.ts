import { registerDecorator } from 'class-validator';
import { isValidPhoneNumber } from 'src/shared/helpers';

export const IsValidPhoneNumber = () => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsValidPhoneNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: `${propertyName} must be a valid phone number.`,
      },
      validator: {
        validate(phoneNumber: string) {
          return isValidPhoneNumber(phoneNumber);
        },
      },
    });
  };
};
