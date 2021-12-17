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