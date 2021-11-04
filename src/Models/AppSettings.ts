import StorageSettings from "@/Models/StorageSettings";

export default interface AppSettings {
    storageSettingsArray: StorageSettings[];
    lastStorageSettingsId?: string;
    lastStorageSettings?: StorageSettings;
}