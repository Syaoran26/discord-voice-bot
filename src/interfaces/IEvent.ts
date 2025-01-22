import { ClientEvents } from 'discord.js';

interface IEvent<T extends keyof ClientEvents> {
    name: T;
    once: boolean;
    execute: (...args: ClientEvents[T]) => void;
}

export default IEvent;
