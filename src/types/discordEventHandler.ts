export interface DiscordEventHandler<EventArgType> {
    name: string;
    once: boolean;
    execute: (EventArgType) => void;
}
