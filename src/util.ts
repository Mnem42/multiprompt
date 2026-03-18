// ggod provided
export type IsPartial<T> = { [K in keyof T]-?: object extends Pick<T, K> ? never : K }[keyof T]extends never ? true : false; 

export type TrueStringLiterals<T extends string> = string extends T ? never : true;
