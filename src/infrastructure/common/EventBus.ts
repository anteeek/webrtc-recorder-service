import { EventEmitter } from "events";
import Logger from "./Logger";

export default class EventBus {

    private static readonly emitter = new EventEmitter();

    static registerHandler<
        EventType extends {
            eventName: string;
            name: string;
            new(...args: any[]): InstanceType<EventType>
        }
    >(
        { eventName }: EventType,
        handler: (e: InstanceType<EventType>) => any
    ) {
        EventBus.emitter.on(eventName, handler);
    }

    static raise(event: { name: string, [key: string]: any }) {
        Logger.silly(`Raised event ${JSON.stringify(event)}`);

        EventBus.emitter.emit(event.name, event);
    }
}