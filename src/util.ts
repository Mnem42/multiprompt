// ggod provided
export type IsPartial<T> = { [K in keyof T]-?: object extends Pick<T, K> ? never : K }[keyof T]extends never ? true : false; 

