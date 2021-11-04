import {Duration} from "moment";
import Task from "@/Models/Task";
import TaskType from "@/Models/TaskType";
export default interface Schedule {
    name: string;
    dayBegin: Duration;
    dayEnd: Duration;
    segmentLength: Duration;
    defaultTaskTypeId: string;

    tasks: Task[];
    taskTypes: TaskType[];
    defaultTaskType: TaskType;
}