type BindingTypes = '';
type Tags = ['fieldtech' | 'expert'];

export interface RegisterBinding {
    address: string,
    bindingType: string,
    tags: (string | Tags)[],
}