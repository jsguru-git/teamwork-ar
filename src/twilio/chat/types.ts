export type TwilioMessage = {
    payload: string,
    attributes: {
        type: TwilioMessageAttributeTypes
    }
}

export type TwilioMessageAttributeTypes = 'TEXT' | 'MEDIA' | 'COMMAND' | 'TRANSLATION';
export enum TwilioMessageAttributeTypesEnum {
    TEXT = 'TEXT',
    MEDIA = 'MEDIA',
    COMMAND = 'COMMAND',
    TRANSLATION = 'TRANSLATION'
}