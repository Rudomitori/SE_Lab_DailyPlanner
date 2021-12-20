export const delay = async (milliseconds: number) => new Promise<void>(c => setTimeout(c, milliseconds))

/** Опции по клонированию навигационнах свойств */
export enum NavPropertyCloneOption {
    /** Установить навигационной свойство == `null` */
    SetNull,
    /** Копировать значение навигационного свойства без изменений */
    Include,
    /** Клонировать содержимое навигационного свойства */
    Clone
}

/**
 * Сохранить файл в файловую систему
 * @param blob объект, который будет сохранён
 * @param name имя файла, под которым будет предложено сохранить файл
 */
export function saveBlobAsFile(blob: Blob, name: string) : void {
    const link = document.createElement('a');
    link.download = name;

    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
}

export function openFileChooseWindow(): Promise<File | null> {
    return new Promise<File | null>(resolve => {
        const input = document.createElement('input');
        input.type = "file";

        input.click();

        input.onchange = () => {
            resolve(input.files && input.files[0])
        }
    })
}