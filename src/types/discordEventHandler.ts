export interface DiscordEventHandler<T extends readonly unknown[]> {
    name: string;
    once: boolean;
    execute: (...args: T) => void;
}
