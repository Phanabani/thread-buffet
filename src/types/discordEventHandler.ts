export interface DiscordEventHandler<EventArgs extends readonly unknown[]> {
    name: string;
    once: boolean;
    execute: (...args: EventArgs) => Promise<void>;
}
