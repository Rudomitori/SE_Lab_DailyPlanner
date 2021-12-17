import {Duration} from "moment";
import Task, {cloneTask} from "@/Models/Task";
import TaskType, {cloneTaskType} from "@/Models/TaskType";
import {NavPropertyCloneOption} from "@/utils";
export default interface Schedule {
    name: string;
    dayBegin: Duration;
    dayEnd: Duration;
    segmentLength: Duration;
    defaultTaskTypeId: string;

    tasks: Task[] | null;
    taskTypes: TaskType[] | null;
    defaultTaskType: TaskType | null;
}

export function cloneSchedule(
    schedule: Schedule,
    tasksNavOpt = NavPropertyCloneOption.SetNull,
    taskTypesNavOpt = NavPropertyCloneOption.SetNull,
    defaultTaskTypeNavOpt = NavPropertyCloneOption.SetNull,
): Schedule {
    return {
        name: schedule.name,
        dayBegin: schedule.dayBegin.clone(),
        dayEnd: schedule.dayEnd.clone(),
        segmentLength: schedule.segmentLength.clone(),
        defaultTaskTypeId: schedule.defaultTaskTypeId,

        tasks: tasksNavOpt === NavPropertyCloneOption.SetNull ? null
            : tasksNavOpt === NavPropertyCloneOption.Include ? schedule.tasks
                : schedule.tasks?.map(x => cloneTask(x, taskTypesNavOpt)) || null,

        taskTypes: taskTypesNavOpt === NavPropertyCloneOption.SetNull ? null
            : taskTypesNavOpt === NavPropertyCloneOption.Include ? schedule.taskTypes
                : schedule.taskTypes?.map(x => cloneTaskType(x)) || null,

        defaultTaskType: defaultTaskTypeNavOpt === NavPropertyCloneOption.SetNull ? null
            : defaultTaskTypeNavOpt === NavPropertyCloneOption.Include ? schedule.defaultTaskType
                : schedule.defaultTaskType ? cloneTaskType(schedule.defaultTaskType) : null
    }
}
