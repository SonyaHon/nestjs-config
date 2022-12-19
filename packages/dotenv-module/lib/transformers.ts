export const IntoInteger = (value: string) => parseInt(value);
export const IntoNumber = (value: string) => parseFloat(value);
export const IntoBoolean = (value: string) => value === 'true' ? true : false;
export const IntoCommaSeperatedStringList = (innerTransformer?: (v: string) => any) => (value: string) => {
    const transformer = innerTransformer ? innerTransformer : (v: string) => { return v; };
    return value.split(',').map(innerTransformer ?? transformer);
}