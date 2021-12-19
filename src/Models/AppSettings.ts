export default interface AppSettings {
    lastLocalStorageKey: string | null,
    lastStorageType: StorageTypes
}

export enum StorageTypes {
    Local,
    File
}