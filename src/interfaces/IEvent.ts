import { ClientEvents } from 'discord.js';

interface IEvent<T extends keyof ClientEvents> {
    name: T;
    once: Boolean;
    execute: (...args: ClientEvents[T]) => void;
}

export default IEvent;
