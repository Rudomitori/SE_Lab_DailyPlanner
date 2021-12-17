export default interface TaskType {
    id: string;
    name: string;
    colors: string[];
    font: string;
    priority: number;
}

export function cloneTaskType(type: TaskType): TaskType {
    return {
        id: type.id,
        name: type.name,
        colors: type.colors.slice(),
        font: type.font,
        priority: type.priority
    }
}