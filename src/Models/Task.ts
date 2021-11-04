import {Moment} from "moment";
import TaskType from "@/Models/TaskType";

export default interface Task {
    id: string;
    typeId: string;
    name: string;
    begin: Moment;
    end: Moment;
    isDone: boolean;
    description?: string;
    taskType?: TaskType
}