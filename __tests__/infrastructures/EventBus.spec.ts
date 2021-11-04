import EventBus from "../../src/infrastructure/common/EventBus";

class SEvent {
    static eventName = "SEvent";
    name = SEvent.eventName;
    createdAt = Date.now().toString();
}

describe("Event bus", () => {

    it("Should fire a handler when an event is raised", () => {

        const handler = jest.fn();

        EventBus.registerHandler(SEvent, handler);

        const event = new SEvent();

        EventBus.raise(event);

        expect(handler).toHaveBeenCalledWith(event);
    });

    it("Should NOT fire a handler when another event has been called", () => {
        const handler = jest.fn();

        class AnotherEvent {
            static eventName = SEvent.eventName + "23434";
            name = AnotherEvent.eventName;
        }

        EventBus.registerHandler(AnotherEvent, handler);

        const event = new SEvent();

        EventBus.raise(event);

        expect(handler).not.toHaveBeenCalledWith(event);
    });

    it("Should call ALL handlers upon event", () => {

        const handlers = [jest.fn(), jest.fn(), jest.fn()];

        handlers.forEach(handler => {
            EventBus.registerHandler(SEvent, handler);
        })

        const event = new SEvent();

        EventBus.raise(event);

        handlers.forEach(handler => {
            expect(handler).toHaveBeenCalledWith(event);
        });

    })
})