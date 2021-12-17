import {Moment} from "moment";
import TaskType, {cloneTaskType} from "@/Models/TaskType";
import {NavPropertyCloneOption} from "@/utils";

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

export function cloneTask(task: Task, taskTypeNavOpt = NavPropertyCloneOption.SetNull): Task {
    return {
        id: task.id,
        typeId: task.typeId,
        name: task.name,
        begin: task.begin,
        end: task.end,
        isDone: task.isDone,
        description: task.description,

        taskType: taskTypeNavOpt === NavPropertyCloneOption.SetNull ? null
            : taskTypeNavOpt === NavPropertyCloneOption.Include ? task.taskType
                : task.taskType ? cloneTaskType(task.taskType) : null
    }
}