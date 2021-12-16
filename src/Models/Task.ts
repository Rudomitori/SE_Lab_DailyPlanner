import {Moment} from "moment";
import TaskType from "@/Models/TaskType";

export default interface Task {
    id: string;
    typeId: string;
    name: string;
    begin: Moment;
    end: Moment;
    isDone: boolean;
    description: string | null;
    taskType: TaskType | null
}

export function cloneTask(task: Task): Task {
    return {
        id: task.id,
        typeId: task.typeId,
        name: task.name,
        begin: task.begin,
        end: task.end,
        isDone: task.isDone,
        description: task.description,
        taskType: task.taskType
    }
}